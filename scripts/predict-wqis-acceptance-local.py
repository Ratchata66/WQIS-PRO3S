import json
import math
import sys
from pathlib import Path

from PIL import Image, ImageStat


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

MODEL_PATH = Path(__file__).resolve().parents[1] / "local-ai" / "wqis-acceptance-model.json"


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
        features.extend([v / 255.0 for v in stat_rgb.mean])
        features.extend([v / 255.0 for v in stat_rgb.stddev])
        features.append(stat_gray.mean[0] / 255.0)
        features.append(stat_gray.stddev[0] / 255.0)
        features.append(stat_hsv.mean[1] / 255.0)
        features.append(stat_hsv.mean[2] / 255.0)

        hist = gray.histogram()
        total = max(1, sum(hist))
        for start in range(0, 256, 16):
            features.append(sum(hist[start:start + 16]) / total)

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


def normalize(vec, means, stds):
    return [(v - means[i]) / stds[i] for i, v in enumerate(vec)]


def euclidean(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def predict(path, model):
    vec = normalize(image_features(path), model["feature_mean"], model["feature_std"])
    neighbors = []
    for sample in model["samples"]:
        neighbors.append((euclidean(vec, sample["features"]), sample["label"]))
    neighbors.sort(key=lambda item: item[0])
    nearest = neighbors[:model.get("k", 9)]

    votes = {label: 0.0 for label in model["labels"]}
    for dist, label in nearest:
        votes[label] += 1.0 / (dist + 1e-6)

    total = sum(votes.values()) or 1.0
    scores = {label: votes[label] / total for label in model["labels"]}
    best = max(scores, key=scores.get)
    reason = "knn"

    guard = model.get("color_guard") or {}
    if guard.get("enabled") and best != "not_a_weld" and scores.get("not_a_weld", 0) < 0.55:
        color = color_guard_features(path)
        limits = guard.get("limits", {})
        exceeded = [
            key for key, value in color.items()
            if value > limits.get(key, 1.0)
        ]
        if exceeded:
            best = "fail"
            scores["fail"] = max(scores.get("fail", 0), 0.75)
            reason = "color_guard:" + ",".join(exceeded)

    return best, scores, reason


def main(argv):
    if len(argv) < 2:
        raise SystemExit("Usage: python scripts/predict-wqis-acceptance-local.py <image> [<image> ...]")

    model = json.loads(MODEL_PATH.read_text(encoding="utf-8"))
    for item in argv[1:]:
        path = Path(item)
        print(f"{path}")
        try:
            label, scores, reason = predict(path, model)
            score_text = ", ".join(f"{name}={scores[name] * 100:.1f}%" for name in model["labels"])
            print(f"  prediction: {label}")
            print(f"  reason: {reason}")
            print(f"  scores: {score_text}")
        except Exception as exc:
            print(f"  error: {exc}")


if __name__ == "__main__":
    main(sys.argv)
