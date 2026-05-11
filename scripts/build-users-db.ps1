param(
    [string]$WorkbookPath = "database\WQIS_User_Database_Template.xlsx"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$xlsxPath = Join-Path $projectRoot $WorkbookPath
if (!(Test-Path -LiteralPath $xlsxPath)) {
    throw "User database workbook not found: $xlsxPath"
}

$tmp = Join-Path $env:TEMP ("wqis_users_" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
$zip = Join-Path $tmp "users.zip"
Copy-Item -LiteralPath $xlsxPath -Destination $zip
Expand-Archive -LiteralPath $zip -DestinationPath $tmp -Force

$ns = New-Object System.Xml.XmlNamespaceManager((New-Object System.Xml.NameTable))
$ns.AddNamespace("x", "http://schemas.openxmlformats.org/spreadsheetml/2006/main")

function Read-Xml($path) {
    $doc = New-Object System.Xml.XmlDocument
    $doc.PreserveWhitespace = $false
    $doc.Load($path)
    return $doc
}

$sharedStrings = @()
$sharedPath = Join-Path $tmp "xl\sharedStrings.xml"
if (Test-Path -LiteralPath $sharedPath) {
    $ssDoc = Read-Xml $sharedPath
    foreach ($si in $ssDoc.SelectNodes("//x:si", $ns)) {
        $parts = @()
        foreach ($t in $si.SelectNodes(".//x:t", $ns)) { $parts += $t.InnerText }
        $sharedStrings += ($parts -join "")
    }
}

function Get-ColumnIndex([string]$cellRef) {
    $letters = ($cellRef -replace '[0-9]', '').ToUpperInvariant()
    $n = 0
    foreach ($ch in $letters.ToCharArray()) {
        $n = ($n * 26) + ([int][char]$ch - [int][char]'A' + 1)
    }
    return $n - 1
}

function Get-CellValue($cell) {
    $type = $cell.GetAttribute("t")
    if ($type -eq "inlineStr") {
        $node = $cell.SelectSingleNode(".//x:t", $ns)
        if ($node) { return $node.InnerText }
        return ""
    }
    $valueNode = $cell.SelectSingleNode("./x:v", $ns)
    if (!$valueNode) { return "" }
    $raw = $valueNode.InnerText
    if ($type -eq "s") {
        $idx = [int]$raw
        if ($idx -ge 0 -and $idx -lt $sharedStrings.Count) { return $sharedStrings[$idx] }
        return ""
    }
    return $raw
}

$sheetPath = Join-Path $tmp "xl\worksheets\sheet1.xml"
$sheet = Read-Xml $sheetPath
$rows = @()
foreach ($row in $sheet.SelectNodes("//x:sheetData/x:row", $ns)) {
    $values = @{}
    foreach ($cell in $row.SelectNodes("./x:c", $ns)) {
        $values[(Get-ColumnIndex $cell.GetAttribute("r"))] = (Get-CellValue $cell).Trim()
    }
    $max = if ($values.Keys.Count) { ($values.Keys | Measure-Object -Maximum).Maximum } else { -1 }
    $arr = @()
    for ($i = 0; $i -le $max; $i++) { $arr += $(if ($values.ContainsKey($i)) { $values[$i] } else { "" }) }
    if (($arr -join "").Trim()) { $rows += ,$arr }
}

if ($rows.Count -lt 2) { throw "Users sheet has no user rows." }

$headers = @{}
for ($i = 0; $i -lt $rows[0].Count; $i++) {
    $headers[$rows[0][$i].ToLowerInvariant()] = $i
}

function Field($row, $name) {
    $idx = $headers[$name]
    if ($null -eq $idx -or $idx -ge $row.Count) { return "" }
    return [string]$row[$idx]
}

$allowedRoles = @("admin", "inspector", "viewer")
$users = @()
$id = 1
for ($r = 1; $r -lt $rows.Count; $r++) {
    $row = $rows[$r]
    $email = (Field $row "email").Trim().ToLowerInvariant()
    $password = (Field $row "temporary_password").Trim()
    $name = (Field $row "full_name").Trim()
    $role = (Field $row "role").Trim().ToLowerInvariant()
    $status = (Field $row "status").Trim().ToLowerInvariant()

    if (!$email -or !$password -or !$name) { continue }
    if (!$allowedRoles.Contains($role)) { throw "Invalid role '$role' for user '$email'. Use admin, inspector, or viewer." }
    if (!$status) { $status = "active" }
    if ($status -notin @("active", "disabled")) { throw "Invalid status '$status' for user '$email'. Use active or disabled." }

    $avatar = $name.Substring(0, 1).ToUpperInvariant()
    $users += [pscustomobject]@{
        id = $id
        username = $email
        password = $password
        role = $role
        name = $name
        avatar = $avatar
        status = $status
    }
    $id++
}

if (!$users.Count) { throw "No valid active/disabled users found in workbook." }

$json = $users | ConvertTo-Json -Depth 5
$browserJs = @"
'use strict';
window.WQIS_USERS = $json;
"@
$functionJs = @"
'use strict';
exports.users = $json;
"@

[System.IO.File]::WriteAllText((Join-Path $projectRoot "generated-users.js"), $browserJs, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $projectRoot "netlify\functions\generated-users.js"), $functionJs, [System.Text.UTF8Encoding]::new($false))

Remove-Item -LiteralPath $tmp -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Generated $($users.Count) WQIS login user(s)."
Write-Host "Local/Electron: generated-users.js"
Write-Host "Netlify: netlify/functions/generated-users.js"
