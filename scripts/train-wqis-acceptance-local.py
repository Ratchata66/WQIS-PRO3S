import json
import math
import random
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageStat


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

SOURCE_DIR = Path.home() / "Desktop" / "Roboflow_WQIS_Acceptance"
OUTPUT_DIR = Path(__file__).resolve().parents[1] / "local-ai"
MODEL_PATH = OUTPUT_DIR / "wqis-acceptance-model.json"
REPORT_PATH = OUTPUT_DIR / "wqis-acceptance-report.json"

CLASSES = ["fail", "not_a_weld", "pass"]
RANDOM_SEED = 20260512
K_NEIGHBORS = 9


def iter_images(class_dir):
    exts = {".jpg", ".jpeg", ".png", ".bmp", ".webp", ".avif"}
    return sorted(p for p in class_dir.iterdir() if p.is_file() and p.suffix.lower() in exts)


def split_dataset(paths):
    rng = random.Random(RANDOM_SEED)
    shuffled = list(paths)
    rng.shuffle(shuffled)
    n = len(shuffled)
    train_n = max(1, int(n * 0.70))
    valid_n = max(1, int(n * 0.20))
    return {
        "train": shuffled[:train_n],
        "valid": shuffled[train_n : train_n + valid_n],
        "test": shuffled[train_n + valid_n :],
    }


def image_features(path):
    with Image.open(path) as img:
        img = img.convert("RGB")
        small = img.resize((32, 32), Image.Resampling.BILINEAR)
        gray = small.convert("L")
        hsv = small.convert("HSV")

        stat_rgb = ImageStat.Stat(small)
        stat_gray = ImageStat.Stat(gray)
        stat_hsv = ImageStat.Stat(hsv)

        features = []

        # Global color/brightness signals.
        features.extend([v / 255.0 for v in stat_rgb.mean])
        features.extend([v / 255.0 for v in stat_rgb.stddev])
        features.append(stat_gray.mean[0] / 255.0)
        features.append(stat_gray.stddev[0] / 255.0)
        features.append(stat_hsv.mean[1] / 255.0)  # saturation
        features.append(stat_hsv.mean[2] / 255.0)  # value

        # Brightness histogram.
        hist = gray.histogram()
        total = max(1, sum(hist))
        bin_size = 16
        for start in range(0, 256, bin_size):
            features.append(sum(hist[start : start + bin_size]) / total)

        # Coarse spatial layout, useful for distinguishing weld strips from random photos.
        if hasattr(gray, "get_flattened_data"):
            pixels = list(gray.get_flattened_data())
        else:
            pixels = list(gray.getdata())
        for by in range(0, 32, 4):
            for bx in range(0, 32, 4):
                values = []
                for y in range(by, by + 4):
                    row = y * 32
                    for x in range(bx, bx + 4):
                        values.append(pixels[row + x])
                features.append((sum(values) / len(values)) / 255.0)

        # Lightweight edge energy grid.
        for by in range(0, 32, 8):
            for bx in range(0, 32, 8):
                energy = 0
                count = 0
                for y in range(by, by + 7):
                    row = y * 32
                    next_row = (y + 1) * 32
                    for x in range(bx, bx + 7):
                        gx = abs(pixels[row + x + 1] - pixels[row + x])
                        gy = abs(pixels[next_row + x] - pixels[row + x])
                        energy += gx + gy
                        count += 2
                features.append((energy / max(1, count)) / 255.0)

        return features


def color_guard_features(path):
    with Image.open(path) as img:
        hsv = img.convert("RGB").resize((64, 64), Image.Resampling.BILINEAR).convert("HSV")
        if hasattr(hsv, "get_flattened_data"):
            pixels = list(hsv.get_flattened_data())
        else:
            pixels = list(hsv.getdata())

    usable = [
        (h / 255.0, s / 255.0, v / 255.0)
        for h, s, v in pixels
        if 0.08 <= (v / 255.0) <= 0.96
    ]
    total = max(1, len(usable))

    chroma = 0
    warm = 0
    blue = 0
    dark_colored = 0
    for h, s, v in usable:
        if s > 0.22:
            chroma += 1
            hue_deg = h * 360.0
            if 15 <= hue_deg <= 70:
                warm += 1
            if 185 <= hue_deg <= 265:
                blue += 1
            if v < 0.35:
                dark_colored += 1

    return {
        "chroma_ratio": chroma / total,
        "warm_ratio": warm / total,
        "blue_ratio": blue / total,
        "dark_colored_ratio": dark_colored / total,
    }


def mean_vector(vectors):
    cols = len(vectors[0])
    return [sum(row[i] for row in vectors) / len(vectors) for i in range(cols)]


def std_vector(vectors, means):
    cols = len(vectors[0])
    out = []
    for i in range(cols):
        variance = sum((row[i] - means[i]) ** 2 for row in vectors) / len(vectors)
        out.append(max(math.sqrt(variance), 1e-6))
    return out


def normalize(vec, means, stds):
    return [(v - means[i]) / stds[i] for i, v in enumerate(vec)]


def euclidean(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def predict_centroid(vec, model):
    norm = normalize(vec, model["feature_mean"], model["feature_std"])
    distances = {
        label: euclidean(norm, centroid)
        for label, centroid in model["centroids"].items()
    }
    best = min(distances, key=distances.get)
    inv = {label: math.exp(-dist) for label, dist in distances.items()}
    denom = sum(inv.values()) or 1.0
    scores = {label: inv[label] / denom for label in model["labels"]}
    return best, scores, distances


def predict_knn(vec, model):
    norm = normalize(vec, model["feature_mean"], model["feature_std"])
    neighbors = []
    for sample in model["samples"]:
        dist = euclidean(norm, sample["features"])
        neighbors.append((dist, sample["label"]))
    neighbors.sort(key=lambda item: item[0])
    nearest = neighbors[: model["k"]]

    votes = {label: 0.0 for label in model["labels"]}
    for dist, label in nearest:
        votes[label] += 1.0 / (dist + 1e-6)

    total = sum(votes.values()) or 1.0
    scores = {label: votes[label] / total for label in model["labels"]}
    best = max(scores, key=scores.get)
    return best, scores, {label: 1.0 - scores[label] for label in model["labels"]}


def mean(values):
    return sum(values) / max(1, len(values))


def stddev(values):
    avg = mean(values)
    return math.sqrt(sum((v - avg) ** 2 for v in values) / max(1, len(values)))


def build_color_guard(pass_rows):
    keys = ["chroma_ratio", "warm_ratio", "blue_ratio", "dark_colored_ratio"]
    limits = {}
    for key in keys:
        values = [row["color"][key] for row in pass_rows]
        limits[key] = min(0.45, max(0.08, mean(values) + 2.2 * stddev(values)))

    # Heat-tint colours are important failure cues, so keep these caps tighter than chroma overall.
    limits["warm_ratio"] = min(limits["warm_ratio"], 0.18)
    limits["blue_ratio"] = min(limits["blue_ratio"], 0.16)
    limits["dark_colored_ratio"] = min(limits["dark_colored_ratio"], 0.20)
    return {
        "enabled": True,
        "description": "Override weld-like images to fail when colour ratios exceed the pass-weld profile.",
        "limits": limits,
    }


def predict(vec, model):
    if model.get("algorithm") == "knn":
        return predict_knn(vec, model)
    return predict_centroid(vec, model)


def evaluate(rows, model):
    matrix = {actual: {pred: 0 for pred in model["labels"]} for actual in model["labels"]}
    correct = 0
    examples = []
    for row in rows:
        pred, scores, distances = predict(row["features"], model)
        actual = row["label"]
        matrix[actual][pred] += 1
        correct += int(pred == actual)
        if pred != actual and len(examples) < 20:
            examples.append({
                "file": row["path"],
                "actual": actual,
                "predicted": pred,
                "scores": scores,
                "distances": distances,
            })
    return {
        "accuracy": correct / max(1, len(rows)),
        "count": len(rows),
        "confusion_matrix": matrix,
        "misclassified_examples": examples,
    }


def main():
    if not SOURCE_DIR.exists():
        raise SystemExit(f"Dataset folder not found: {SOURCE_DIR}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    splits = {"train": [], "valid": [], "test": []}
    class_counts = {}

    for label in CLASSES:
        class_dir = SOURCE_DIR / label
        if not class_dir.exists():
            raise SystemExit(f"Missing class folder: {class_dir}")
        paths = iter_images(class_dir)
        class_counts[label] = len(paths)
        class_splits = split_dataset(paths)
        for split_name, split_paths in class_splits.items():
            for path in split_paths:
                splits[split_name].append({
                    "label": label,
                    "path": str(path),
                    "features": image_features(path),
                    "color": color_guard_features(path),
                })

    train_rows = splits["train"]
    feature_mean = mean_vector([row["features"] for row in train_rows])
    feature_std = std_vector([row["features"] for row in train_rows], feature_mean)

    centroids = {}
    for label in CLASSES:
        class_vectors = [
            normalize(row["features"], feature_mean, feature_std)
            for row in train_rows
            if row["label"] == label
        ]
        centroids[label] = mean_vector(class_vectors)

    color_guard = build_color_guard([row for row in train_rows if row["label"] == "pass"])

    model = {
        "name": "WQIS Acceptance Local Classifier",
        "version": "baseline-knn-v1",
        "algorithm": "knn",
        "k": K_NEIGHBORS,
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "labels": CLASSES,
        "source": str(SOURCE_DIR),
        "feature_count": len(feature_mean),
        "feature_mean": feature_mean,
        "feature_std": feature_std,
        "centroids": centroids,
        "color_guard": color_guard,
        "samples": [
            {
                "label": row["label"],
                "path": row["path"],
                "features": normalize(row["features"], feature_mean, feature_std),
            }
            for row in train_rows
        ],
        "notes": [
            "Pure-Python/Pillow k-nearest-neighbor baseline.",
            "Use this to validate local inference flow before training a deeper model.",
        ],
    }

    report = {
        "class_counts": class_counts,
        "split_counts": {
            name: dict(defaultdict(int, {label: sum(1 for row in rows if row["label"] == label) for label in CLASSES}))
            for name, rows in splits.items()
        },
        "train": evaluate(splits["train"], model),
        "valid": evaluate(splits["valid"], model),
        "test": evaluate(splits["test"], model),
    }

    MODEL_PATH.write_text(json.dumps(model, indent=2), encoding="utf-8")
    REPORT_PATH.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(f"Model:  {MODEL_PATH}")
    print(f"Report: {REPORT_PATH}")
    print("")
    for split in ["train", "valid", "test"]:
        result = report[split]
        print(f"{split:5s} accuracy: {result['accuracy'] * 100:.2f}% ({result['count']} images)")
        for actual, preds in result["confusion_matrix"].items():
            print(f"  {actual:10s} -> {preds}")


if __name__ == "__main__":
    main()
