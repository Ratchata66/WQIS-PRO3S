import argparse
import json
import sys
from pathlib import Path

from PIL import Image
from ultralytics import YOLO


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

CLASS_MAP = {
    "PASS": "pass",
    "FAIL": "fail",
    "negative_not_a_weld": "negative_not_a_weld",
}


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True)
    parser.add_argument("--image", required=True)
    parser.add_argument("--conf", type=float, default=0.05)
    return parser.parse_args()


def main():
    args = parse_args()
    model_path = Path(args.model)
    image_path = Path(args.image)
    if not model_path.exists():
        raise SystemExit(f"Model not found: {model_path}")
    if not image_path.exists():
        raise SystemExit(f"Image not found: {image_path}")

    with Image.open(image_path) as img:
        width, height = img.size

    model = YOLO(str(model_path))
    results = model.predict(
        source=str(image_path),
        conf=args.conf,
        imgsz=416,
        verbose=False,
        device="cpu",
    )

    predictions = []
    result = results[0]
    names = result.names or {}
    if result.boxes is not None:
        for box in result.boxes:
            cls_id = int(box.cls[0])
            raw_name = str(names.get(cls_id, cls_id))
            label = CLASS_MAP.get(raw_name, raw_name.lower())
            x1, y1, x2, y2 = [float(v) for v in box.xyxy[0].tolist()]
            predictions.append({
                "class": label,
                "confidence": float(box.conf[0]),
                "x": (x1 + x2) / 2,
                "y": (y1 + y2) / 2,
                "width": max(0.0, x2 - x1),
                "height": max(0.0, y2 - y1),
            })

    print(json.dumps({
        "source": "local-yolo",
        "model": str(model_path),
        "image": {"width": width, "height": height},
        "predictions": predictions,
    }))


if __name__ == "__main__":
    main()
