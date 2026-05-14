$ErrorActionPreference = "Stop"

$DatasetDir = Join-Path (Get-Location) "datasets\wqis-weld-detection-yolov8-boxes"
$DataYaml = Join-Path $DatasetDir "data.yaml"
$RunName = "wqis-weld-detection-v1"
$VenvPython = Join-Path (Get-Location) ".venv-yolo\Scripts\python.exe"
$YoloExe = Join-Path (Get-Location) ".venv-yolo\Scripts\yolo.exe"
$Epochs = if ($env:WQIS_YOLO_EPOCHS) { $env:WQIS_YOLO_EPOCHS } else { "50" }
$ImageSize = if ($env:WQIS_YOLO_IMGSZ) { $env:WQIS_YOLO_IMGSZ } else { "416" }
$Batch = if ($env:WQIS_YOLO_BATCH) { $env:WQIS_YOLO_BATCH } else { "1" }

if (-not (Test-Path -LiteralPath $DataYaml)) {
    throw "Missing data.yaml: $DataYaml"
}

Write-Host "Dataset: $DatasetDir"
Write-Host "Data:    $DataYaml"
Write-Host "Epochs:  $Epochs"
Write-Host "Image:   $ImageSize"
Write-Host "Batch:   $Batch"
Write-Host ""

if (-not (Test-Path -LiteralPath $VenvPython)) {
    throw "Missing YOLO virtualenv. Expected: $VenvPython"
}
if (-not (Test-Path -LiteralPath $YoloExe)) {
    throw "Missing YOLO CLI. Install with: .\.venv-yolo\Scripts\python.exe -m pip install ultralytics"
}

$env:PYTHONIOENCODING = "utf-8"
& $VenvPython -c "import ultralytics, torch; print('ultralytics', ultralytics.__version__); print('torch', torch.__version__); print('cuda', torch.cuda.is_available())"

# The Roboflow export contains polygon-like labels. We convert them to rectangular boxes
# and train a normal detector because the app needs square bounding boxes.
& $YoloExe detect train `
    model=yolov8n.pt `
    data="$DataYaml" `
    imgsz=$ImageSize `
    epochs=$Epochs `
    batch=$Batch `
    name="$RunName" `
    project="runs/wqis" `
    patience=20 `
    workers=0

Write-Host ""
Write-Host "Training complete. Check:"
Write-Host "  runs\wqis\$RunName\weights\best.pt"
