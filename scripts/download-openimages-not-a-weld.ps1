$ErrorActionPreference = "Stop"

$WorkspaceRoot = Split-Path -Parent $PSScriptRoot
$MetadataPath = Join-Path $WorkspaceRoot "openimages_test_sample.csv"
$MetadataUrl = "https://storage.googleapis.com/openimages/2018_04/test/test-images-with-rotation.csv"
$Dest = Join-Path $HOME "Desktop\Roboflow_WQIS_Acceptance\not_a_weld"
$ZipPath = Join-Path $HOME "Desktop\Roboflow_WQIS_Acceptance.zip"
$AcceptanceRoot = Join-Path $HOME "Desktop\Roboflow_WQIS_Acceptance"
$TargetCount = 200

if (-not (Test-Path -LiteralPath $Dest)) {
    New-Item -ItemType Directory -Path $Dest -Force | Out-Null
}

if (-not (Test-Path -LiteralPath $MetadataPath)) {
    Invoke-WebRequest -Uri $MetadataUrl -OutFile $MetadataPath -TimeoutSec 180
}

$existingImages = @(Get-ChildItem -LiteralPath $Dest -File | Where-Object {
    $_.Extension -match '^\.(jpg|jpeg|png)$'
})

if ($existingImages.Count -ge $TargetCount) {
    Write-Host "not_a_weld already has $($existingImages.Count) images."
} else {
    $needed = $TargetCount - $existingImages.Count
    $rows = @(Import-Csv -LiteralPath $MetadataPath | Where-Object {
        $_.Thumbnail300KURL -and
        $_.Title -notmatch '(?i)weld|welding|welder|solder|brazing'
    })

    if (-not $rows.Count) {
        throw "No Open Images rows available in metadata file."
    }

    $usedIds = @{}
    foreach ($file in $existingImages) {
        if ($file.BaseName -match 'openimages_([a-f0-9]+)_') {
            $usedIds[$matches[1]] = $true
        }
    }

    $candidates = @($rows | Get-Random -Count ([Math]::Min($rows.Count, $needed * 8)))
    $downloaded = 0
    $attempted = 0

    foreach ($row in $candidates) {
        if ($downloaded -ge $needed) { break }
        if ($usedIds.ContainsKey($row.ImageID)) { continue }

        $attempted++
        $seq = $existingImages.Count + $downloaded + 1
        $target = Join-Path $Dest ("openimages_{0}_{1:D3}.jpg" -f $row.ImageID, $seq)

        try {
            Invoke-WebRequest -Uri $row.Thumbnail300KURL -OutFile $target -TimeoutSec 20
            $item = Get-Item -LiteralPath $target
            if ($item.Length -lt 2048) {
                Remove-Item -LiteralPath $target -Force
                continue
            }
            $downloaded++
            $usedIds[$row.ImageID] = $true
            if ($downloaded % 25 -eq 0) {
                Write-Host "Downloaded $downloaded / $needed new images..."
            }
        } catch {
            if (Test-Path -LiteralPath $target) {
                Remove-Item -LiteralPath $target -Force
            }
        }
    }

    Write-Host "Downloaded $downloaded new not_a_weld images after $attempted attempts."
}

if (Test-Path -LiteralPath $ZipPath) {
    Remove-Item -LiteralPath $ZipPath -Force
}
Compress-Archive -Path (Join-Path $AcceptanceRoot "*") -DestinationPath $ZipPath -Force

$counts = Get-ChildItem -Directory $AcceptanceRoot | ForEach-Object {
    [PSCustomObject]@{
        Class = $_.Name
        Count = @(Get-ChildItem -LiteralPath $_.FullName -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg|png)$' }).Count
    }
} | Sort-Object Class

Write-Host ""
Write-Host "Updated dataset:"
$counts | Format-Table -AutoSize
Write-Host "Zip: $ZipPath"
