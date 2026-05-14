$ErrorActionPreference = "Stop"

$SourceRoot = Join-Path $HOME "Desktop\Ex.Welding joint"
$AcceptanceRoot = Join-Path $HOME "Desktop\Roboflow_WQIS_Acceptance"
$Dest = Join-Path $HOME "Desktop\Roboflow_WQIS_Detection_Annotate"
$Zip = Join-Path $HOME "Desktop\Roboflow_WQIS_Detection_Annotate.zip"

function Reset-Directory($Path) {
    if (Test-Path -LiteralPath $Path) {
        Remove-Item -LiteralPath $Path -Recurse -Force
    }
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
}

function Normalize-ClassName($Name) {
    $name = $Name.ToLowerInvariant() -replace '\s+', '_' -replace '[^a-z0-9_]', ''
    if ($name -eq "discolouration") { return "discoloration" }
    return $name
}

function Get-Images($Path) {
    return @(Get-ChildItem -LiteralPath $Path -Recurse -File | Where-Object {
        $_.Extension -match '^\.(jpg|jpeg|png)$'
    })
}

function Copy-WithManifest($Images, $OutDir, $Prefix, $ClassName, [ref]$Manifest) {
    New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
    $i = 1
    foreach ($img in $Images) {
        $ext = $img.Extension.ToLowerInvariant()
        $file = "{0}_{1:D4}{2}" -f $Prefix, $i, $ext
        Copy-Item -LiteralPath $img.FullName -Destination (Join-Path $OutDir $file) -Force
        $Manifest.Value += [PSCustomObject]@{
            file = $file
            suggested_class = $ClassName
            source = $img.FullName
        }
        $i++
    }
}

if (-not (Test-Path -LiteralPath $SourceRoot)) {
    throw "Source folder not found: $SourceRoot"
}

Reset-Directory $Dest
$imagesDir = Join-Path $Dest "images_to_upload"
New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null

$manifest = @()

# Pass welds: sample a manageable amount. Annotate the visible weld bead as joint_pass.
$passSource = Join-Path $SourceRoot "Complete weld penetation"
$passImages = Get-Images $passSource
$passSample = @($passImages | Get-Random -Count ([Math]::Min(250, $passImages.Count)))
Copy-WithManifest -Images $passSample -OutDir $imagesDir -Prefix "joint_pass" -ClassName "joint_pass" -Manifest ([ref]$manifest)

# Defects: copy all current examples. Annotate only the defect region, not the entire weld.
$failSource = Join-Path $SourceRoot "Uncomplete weld penetation"
foreach ($folder in Get-ChildItem -LiteralPath $failSource -Directory) {
    $className = Normalize-ClassName $folder.Name
    $images = Get-Images $folder.FullName
    Copy-WithManifest -Images $images -OutDir $imagesDir -Prefix $className -ClassName $className -Manifest ([ref]$manifest)
}

# Negative examples: no bounding boxes. These teach the detector to ignore non-weld images.
$notWeldSource = Join-Path $AcceptanceRoot "not_a_weld"
if (Test-Path -LiteralPath $notWeldSource) {
    $notWeld = @(Get-Images $notWeldSource | Get-Random -Count ([Math]::Min(100, (Get-Images $notWeldSource).Count)))
    Copy-WithManifest -Images $notWeld -OutDir $imagesDir -Prefix "negative_not_a_weld" -ClassName "NO_BOX_NEGATIVE" -Manifest ([ref]$manifest)
}

$manifest | ConvertTo-Json -Depth 3 | Out-File -LiteralPath (Join-Path $Dest "annotation_manifest.json") -Encoding UTF8

$guide = @"
WQIS Object Detection Annotation Guide

Upload `images_to_upload` to a Roboflow Object Detection project.

Classes to create:
- joint_pass
- weld_bead_meandering
- grinding_mark
- slag_inclusion
- slag_residue
- lack_of_fusion
- undercut
- discoloration

Annotation rules:
1. For files starting with `joint_pass_`, draw one box around the visible weld bead and label it `joint_pass`.
2. For defect files, draw a tight box around the actual defect area, not the whole image.
3. For files starting with negative_not_a_weld_, do not draw any boxes.
4. If a defect is spread along the whole bead, draw a box around the affected bead section.
5. If multiple defects are visible, draw multiple boxes.
6. Keep class names exactly as listed above.

Do not train until at least the defect classes have boxes. Folder names alone do not create bounding boxes.
"@
$guide | Out-File -LiteralPath (Join-Path $Dest "ANNOTATION_GUIDE.txt") -Encoding UTF8

if (Test-Path -LiteralPath $Zip) {
    Remove-Item -LiteralPath $Zip -Force
}
Compress-Archive -Path (Join-Path $Dest "*") -DestinationPath $Zip -Force

Write-Host "Created detection annotation set:"
Write-Host "  Folder: $Dest"
Write-Host "  Zip:    $Zip"
Write-Host ""
Write-Host "Images:"
($manifest | Group-Object suggested_class | Sort-Object Count -Descending | Select-Object Count,Name) | Format-Table -AutoSize
