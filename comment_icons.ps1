# PowerShell script to comment out all icon imports and usage
$files = Get-ChildItem -Path "src" -Recurse -Filter "*.jsx" | Where-Object { 
    (Get-Content $_.FullName -Raw) -match "import.*from.*icons"
}

foreach ($file in $files) {
    Write-Host "Processing: $($file.FullName)"
    
    $content = Get-Content $file.FullName -Raw
    
    # Comment out icon imports
    $content = $content -replace "(^import\s+.*from\s+['""].*icons['""];?)", "// `$1"
    
    # Comment out icon usage patterns
    $content = $content -replace "(<[A-Z][a-zA-Z]*\s+[^>]*className[^>]*>)", "<!-- `$1 -->"
    
    # Comment out icon component usage
    $content = $content -replace "(<[A-Z][a-zA-Z]*\s*/>)", "<!-- `$1 -->"
    
    # Comment out icon component usage with props
    $content = $content -replace "(<[A-Z][a-zA-Z]*\s+[^>]*/>)", "<!-- `$1 -->"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Completed processing $($files.Count) files"
