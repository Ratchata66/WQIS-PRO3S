"""
WQIS-PRO3S  —  YOLO Weld Inference Server
Deploy on Render.com (free tier)
"""
from __future__ import annotations
import base64, io, os, tempfile, time
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── Load YOLO model once at startup ─────────────────────────────────────────
MODEL_PATH = Path(__file__).parent / "yolo-weld-best.pt"
CONF_THRESH = float(os.getenv("YOLO_CONF", "0.20"))

print(f"[WQIS] Loading model from {MODEL_PATH} …")
t0 = time.time()
try:
    from ultralytics import YOLO
    model = YOLO(str(MODEL_PATH))
    # warm-up run
    import numpy as np
    dummy = np.zeros((640, 640, 3), dtype=np.uint8)
    model.predict(dummy, conf=CONF_THRESH, verbose=False)
    print(f"[WQIS] Model ready in {time.time()-t0:.1f}s")
except Exception as e:
    print(f"[WQIS] WARNING: model failed to load — {e}")
    model = None

# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(title="WQIS AI Server", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    imageData: str          # base64 data-URL  "data:image/...;base64,..."


class AnalyzeResponse(BaseModel):
    source: str
    predictions: list
    image: dict | None = None


@app.get("/")
def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/api/analyze-weld", response_model=AnalyzeResponse)
def analyze(body: AnalyzeRequest):
    if model is None:
        raise HTTPException(503, "Model not loaded")

    # ── Decode image ──────────────────────────────────────────────────────────
    try:
        header, b64 = body.imageData.split(",", 1)
        img_bytes = base64.b64decode(b64)
    except Exception:
        raise HTTPException(400, "Invalid imageData — expected base64 data-URL")

    # Write to temp file (ultralytics expects a file path or numpy array)
    suffix = ".jpg"
    if "png" in header:
        suffix = ".png"

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(img_bytes)
        tmp_path = tmp.name

    try:
        from PIL import Image
        img = Image.open(tmp_path)
        w, h = img.size

        results = model.predict(tmp_path, conf=CONF_THRESH, verbose=False)
        result  = results[0]

        predictions = []
        for box in result.boxes:
            cls_id  = int(box.cls[0])
            cls_name = model.names.get(cls_id, str(cls_id))
            conf     = float(box.conf[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            predictions.append({
                "class":      cls_name,
                "confidence": round(conf, 4),
                "bbox": {
                    "x1": round(x1), "y1": round(y1),
                    "x2": round(x2), "y2": round(y2),
                },
            })

        return AnalyzeResponse(
            source="render-yolo",
            predictions=predictions,
            image={"width": w, "height": h},
        )
    finally:
        os.unlink(tmp_path)
