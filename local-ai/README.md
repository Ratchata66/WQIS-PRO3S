# WQIS Local AI

This folder contains the local baseline model trained from:

`C:\Users\Dell\Desktop\Roboflow_WQIS_Acceptance`

## Files

- `wqis-acceptance-model.json` - local k-nearest-neighbor image classifier
- `wqis-acceptance-report.json` - train/valid/test evaluation report
- `yolo-weld-best.pt` - current YOLO detector used by the Electron app

## Retrain

```powershell
npm run ai:train
```

## Current Result

This is a dependency-free baseline using Python + Pillow only.

It also includes a colour guard: if an image looks like a weld but has colour ratios outside the learned `pass` profile, prediction is overridden to `fail`. This helps catch heat tint / oxidation-style failures on blurry images, but can still false-fail under bad lighting or camera white balance.

## Electron YOLO Bridge

The Electron app calls `scripts/predict-yolo-weld-local.py` through `main.js` and `preload.js`.

Current requirements:

- `.venv-yolo` exists in the project root
- `ultralytics` is installed in `.venv-yolo`
- `local-ai/yolo-weld-best.pt` exists

The current detector is only partially trained. It is wired into the app for flow testing and should be retrained to completion before production use.

It is useful for proving the local training/inference workflow, but it is not production-grade yet. The current dataset still confuses `pass` and `fail` because many full weld images look visually similar at whole-image classification level.

For better accuracy:

- Add more `fail` images per defect type.
- Crop or annotate the defect area instead of classifying the whole image only.
- Train a deep learning model with PyTorch/TensorFlow once a compatible runtime is available.
- Keep `not_a_weld` as a separate first-stage classifier.
