# Quick Clean Restart Script
# Run this to clear cache and restart servers

Write-Host "🧹 Cleaning Next.js cache..." -ForegroundColor Cyan

# Remove .next folder if exists
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ .next folder removed" -ForegroundColor Green
} else {
    Write-Host "⚠️  .next folder not found (already clean)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Clear browser cache:" -ForegroundColor White
Write-Host "   - Open DevTools (F12)" -ForegroundColor Gray
Write-Host "   - Right-click Refresh → Empty Cache and Hard Reload" -ForegroundColor Gray
Write-Host "   - Or use Incognito mode (Ctrl+Shift+N)" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  Clear localStorage:" -ForegroundColor White
Write-Host "   - F12 → Console → Run: localStorage.clear()" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  Start Backend (Terminal 1):" -ForegroundColor White
Write-Host "   cd smk3-backend" -ForegroundColor Cyan
Write-Host "   bun run start:dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "4️⃣  Start Frontend (Terminal 2):" -ForegroundColor White
Write-Host "   bun run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "5️⃣  Test Login:" -ForegroundColor White
Write-Host "   http://localhost:3000/login" -ForegroundColor Cyan
Write-Host "   ID: 82400944 / Password: 82400944K3" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Cache cleared! Ready to restart." -ForegroundColor Green
