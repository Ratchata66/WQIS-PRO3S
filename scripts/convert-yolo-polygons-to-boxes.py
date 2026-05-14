import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "datasets" / "wqis-weld-detection-yolov8"
DST = ROOT / "datasets" / "wqis-weld-detection-yolov8-boxes"
SPLITS = ["train", "valid", "test"]


def convert_line(line):
    parts = line.strip().split()
    if not parts:
        return ""
    cls = parts[0]
    values = [float(v) for v in parts[1:]]

    if len(values) == 4:
        x, y, w, h = values
    else:
        xs = values[0::2]
        ys = values[1::2]
        if not xs or not ys:
            return ""
        x1, x2 = max(0.0, min(xs)), min(1.0, max(xs))
        y1, y2 = max(0.0, min(ys)), min(1.0, max(ys))
        x = (x1 + x2) / 2.0
        y = (y1 + y2) / 2.0
        w = max(0.0, x2 - x1)
        h = max(0.0, y2 - y1)

    if w <= 0 or h <= 0:
        return ""
    return f"{cls} {x:.8f} {y:.8f} {w:.8f} {h:.8f}"


def main():
    if DST.exists():
        shutil.rmtree(DST)
    DST.mkdir(parents=True)

    for name in ["README.dataset.txt", "README.roboflow.txt"]:
        src_file = SRC / name
        if src_file.exists():
            shutil.copy2(src_file, DST / name)

    data_yaml = (SRC / "data.yaml").read_text(encoding="utf-8")
    (DST / "data.yaml").write_text(data_yaml, encoding="utf-8")

    total_labels = 0
    total_boxes = 0
    for split in SPLITS:
        src_images = SRC / split / "images"
        src_labels = SRC / split / "labels"
        dst_images = DST / split / "images"
        dst_labels = DST / split / "labels"
        dst_images.mkdir(parents=True)
        dst_labels.mkdir(parents=True)

        for image in src_images.iterdir():
            if image.is_file():
                shutil.copy2(image, dst_images / image.name)

        for label_file in src_labels.glob("*.txt"):
            out_lines = []
            for line in label_file.read_text(encoding="utf-8").splitlines():
                converted = convert_line(line)
                if converted:
                    out_lines.append(converted)
            (dst_labels / label_file.name).write_text("\n".join(out_lines), encoding="utf-8")
            total_labels += 1
            total_boxes += len(out_lines)

    print(f"Created: {DST}")
    print(f"Label files: {total_labels}")
    print(f"Boxes: {total_boxes}")


if __name__ == "__main__":
    main()
