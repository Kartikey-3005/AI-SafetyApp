$files = Get-ChildItem -Recurse -File | Where-Object { 
    $_.FullName -notmatch '\\node_modules\\' -and 
    $_.FullName -notmatch '\\\.git\\' -and 
    $_.FullName -notmatch '\\dist\\' -and 
    $_.FullName -notmatch '\\\.vscode\\' -and
    $_.Name -ne '.gitattributes'
}

Write-Host "Total files found: $($files.Count)"

foreach ($f in $files) {
    $rel = Resolve-Path -Relative $f.FullName
    $cleanPath = $rel -replace '^\.\\', ''
    $cleanPath = $cleanPath -replace '\\', '/'
    
    git add -- $cleanPath
    $diff = git diff --cached --name-only
    if ($diff) {
        $msg = "Add $cleanPath"
        if ($cleanPath -eq "README.md") { $msg = "Update README.md" }
        git commit -m $msg
        Write-Host "[COMMITTED] $cleanPath"
    }
}
