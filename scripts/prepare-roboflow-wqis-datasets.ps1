$ErrorActionPreference = "Stop"

$SourceRoot = Join-Path $HOME "Desktop\Ex.Welding joint"
$Desktop = Join-Path $HOME "Desktop"
$AcceptanceRoot = Join-Path $Desktop "Roboflow_WQIS_Acceptance"
$DefectRoot = Join-Path $Desktop "Roboflow_WQIS_DefectType"
$AcceptanceZip = Join-Path $Desktop "Roboflow_WQIS_Acceptance.zip"
$DefectZip = Join-Path $Desktop "Roboflow_WQIS_DefectType.zip"

$PassSource = Join-Path $SourceRoot "Complete weld penetation"
$FailSource = Join-Path $SourceRoot "Uncomplete weld penetation"

function Assert-Path($Path, $Message) {
    if (-not (Test-Path -LiteralPath $Path)) {
        throw $Message
    }
}

function Reset-Directory($Path) {
    if (Test-Path -LiteralPath $Path) {
        Remove-Item -LiteralPath $Path -Recurse -Force
    }
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
}

function Normalize-ClassName($Name) {
    return ($Name.ToLowerInvariant() -replace '\s+', '_' -replace '[^a-z0-9_]', '')
}

function Copy-RenamedImages($Images, $Destination, $Prefix) {
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    $i = 1
    foreach ($img in $Images) {
        $ext = $img.Extension.ToLowerInvariant()
        $target = Join-Path $Destination ("{0}_{1:D4}{2}" -f $Prefix, $i, $ext)
        Copy-Item -LiteralPath $img.FullName -Destination $target -Force
        $i++
    }
}

function Get-Images($Path) {
    return @(Get-ChildItem -LiteralPath $Path -Recurse -File | Where-Object {
        $_.Extension -match '^\.(jpg|jpeg|png)$'
    })
}

Assert-Path $SourceRoot "Source folder not found: $SourceRoot"
Assert-Path $PassSource "Pass source folder not found: $PassSource"
Assert-Path $FailSource "Fail source folder not found: $FailSource"

$passImages = Get-Images $PassSource
$failImages = Get-Images $FailSource
$sampleSize = [Math]::Min($failImages.Count, $passImages.Count)
$sampledPass = @($passImages | Get-Random -Count $sampleSize)

Reset-Directory $AcceptanceRoot
Reset-Directory $DefectRoot

Copy-RenamedImages -Images $sampledPass -Destination (Join-Path $AcceptanceRoot "pass") -Prefix "pass"
Copy-RenamedImages -Images $failImages -Destination (Join-Path $AcceptanceRoot "fail") -Prefix "fail"
New-Item -ItemType Directory -Path (Join-Path $AcceptanceRoot "not_a_weld") -Force | Out-Null

$acceptanceReadme = @"
WQIS Acceptance Dataset

Use this dataset for a classification model:
- pass
- fail
- not_a_weld

Current not_a_weld folder is intentionally empty. Add real non-weld images before training:
- tools, hands, floor, wall, random metal without weld
- screenshots, documents, blurry/dark/white images
- non-weld factory photos

Recommended Roboflow project type: Classification.
"@
$acceptanceReadme | Out-File -LiteralPath (Join-Path $AcceptanceRoot "README.txt") -Encoding UTF8

$classSummary = @()
foreach ($folder in Get-ChildItem -LiteralPath $FailSource -Directory) {
    $className = Normalize-ClassName $folder.Name
    $images = Get-Images $folder.FullName
    Copy-RenamedImages -Images $images -Destination (Join-Path $DefectRoot $className) -Prefix $className
    $classSummary += [PSCustomObject]@{ Class = $className; Count = $images.Count }
}

$defectReadme = @"
WQIS Defect Type Dataset

Use this dataset for a second classification model after an image is already known to be fail.

Recommended Roboflow project type: Classification.

Important:
- Some classes are very small and need more real images.
- For object detection with bounding boxes, these images still need manual annotation in Roboflow.
"@
$defectReadme | Out-File -LiteralPath (Join-Path $DefectRoot "README.txt") -Encoding UTF8

if (Test-Path -LiteralPath $AcceptanceZip) { Remove-Item -LiteralPath $AcceptanceZip -Force }
if (Test-Path -LiteralPath $DefectZip) { Remove-Item -LiteralPath $DefectZip -Force }
Compress-Archive -Path (Join-Path $AcceptanceRoot "*") -DestinationPath $AcceptanceZip -Force
Compress-Archive -Path (Join-Path $DefectRoot "*") -DestinationPath $DefectZip -Force

$summary = [PSCustomObject]@{
    Source = $SourceRoot
    AcceptanceFolder = $AcceptanceRoot
    AcceptanceZip = $AcceptanceZip
    DefectTypeFolder = $DefectRoot
    DefectTypeZip = $DefectZip
    PassTotalSource = $passImages.Count
    FailTotalSource = $failImages.Count
    PassSampledForAcceptance = $sampleSize
    FailCopiedForAcceptance = $failImages.Count
    DefectClasses = $classSummary
}

$summary | ConvertTo-Json -Depth 4 | Out-File -LiteralPath (Join-Path $Desktop "Roboflow_WQIS_Dataset_Summary.json") -Encoding UTF8

Write-Host "Created:"
Write-Host "  $AcceptanceRoot"
Write-Host "  $AcceptanceZip"
Write-Host "  $DefectRoot"
Write-Host "  $DefectZip"
Write-Host ""
Write-Host "Acceptance dataset:"
Write-Host "  pass: $sampleSize"
Write-Host "  fail: $($failImages.Count)"
Write-Host "  not_a_weld: 0"
Write-Host ""
Write-Host "Defect type dataset:"
$classSummary | Sort-Object Count -Descending | Format-Table -AutoSize
