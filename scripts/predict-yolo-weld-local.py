import argparse
import json
import sys
from pathlib import Path

from PIL import Image


def main():
    parser = argparse.ArgumentParser(description="Run local YOLO weld detection and print JSON.")
    parser.add_argument("--model", required=True)
    parser.add_argument("--image", required=True)
    parser.add_argument("--conf", type=float, default=0.25)
    args = parser.parse_args()

    model_path = Path(args.model)
    image_path = Path(args.image)
    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")
    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    from ultralytics import YOLO

    with Image.open(image_path) as im:
        image_width, image_height = im.size

    model = YOLO(str(model_path))
    results = model.predict(str(image_path), conf=args.conf, verbose=False)
    names = results[0].names
    predictions = []

    for box in results[0].boxes:
        x1, y1, x2, y2 = [float(v) for v in box.xyxy[0].tolist()]
        cls_id = int(box.cls[0].item())
        confidence = float(box.conf[0].item())
        predictions.append({
            "class": str(names.get(cls_id, cls_id)),
            "class_id": cls_id,
            "confidence": confidence,
            "x": (x1 + x2) / 2,
            "y": (y1 + y2) / 2,
            "width": max(0.0, x2 - x1),
            "height": max(0.0, y2 - y1),
        })

    print(json.dumps({
        "source": "local-yolo",
        "model": str(model_path),
        "image": {"width": image_width, "height": image_height},
        "predictions": predictions,
    }, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(json.dumps({"error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)
