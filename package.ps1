# Package MusicTab for Chrome Web Store
# This script creates a ZIP file ready for upload

$extensionName = "MusicTab"
$version = "1.0"
$outputFile = "$extensionName-v$version.zip"

# Files to include
$files = @(
    "manifest.json",
    "background.js",
    "player.html",
    "player.js",
    "jsmediatags.min.js",
    "icon16.png",
    "icon48.png",
    "icon128.png"
)

# Check if all required files exist
$missingFiles = @()
foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "⚠️ Missing required files:" -ForegroundColor Yellow
    $missingFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "Please create these files before packaging." -ForegroundColor Yellow
    exit 1
}

# Remove old ZIP if exists
if (Test-Path $outputFile) {
    Remove-Item $outputFile
    Write-Host "🗑️ Removed old package" -ForegroundColor Gray
}

# Create ZIP
Write-Host "📦 Creating package..." -ForegroundColor Cyan
Compress-Archive -Path $files -DestinationPath $outputFile -CompressionLevel Optimal

# Display result
if (Test-Path $outputFile) {
    $size = (Get-Item $outputFile).Length / 1KB
    Write-Host "✅ Package created successfully!" -ForegroundColor Green
    Write-Host "   File: $outputFile" -ForegroundColor White
    Write-Host "   Size: $([math]::Round($size, 2)) KB" -ForegroundColor White
    Write-Host ""
    Write-Host "📤 Ready to upload to Chrome Web Store!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create package" -ForegroundColor Red
    exit 1
}
