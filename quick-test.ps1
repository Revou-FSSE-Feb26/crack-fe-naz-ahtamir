# Quick Test Script - Shows what to do

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       LOGIN FIX - QUICK TEST GUIDE                     " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Changes Applied:" -ForegroundColor Green
Write-Host "   - AuthContext: Fixed user mapping" -ForegroundColor Gray
Write-Host "   - Login page: Added debug logs and delay" -ForegroundColor Gray
Write-Host "   - Auth layout: Added debug tracking" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 Test Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Clear Browser Cache" -ForegroundColor White
Write-Host "   Use INCOGNITO MODE (Ctrl+Shift+N)" -ForegroundColor Cyan
Write-Host "   Or clear localStorage in console" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Start Backend (Terminal 1)" -ForegroundColor White
Write-Host "   cd smk3-backend" -ForegroundColor Cyan
Write-Host "   bun run start:dev" -ForegroundColor Cyan
Write-Host ""

Write-Host "3. Start Frontend (Terminal 2)" -ForegroundColor White
Write-Host "   bun run dev" -ForegroundColor Cyan
Write-Host ""

Write-Host "4. Test Login" -ForegroundColor White
Write-Host "   Open: http://localhost:3000/login" -ForegroundColor Cyan
Write-Host "   Open Console (F12)" -ForegroundColor Yellow
Write-Host "   Login:" -ForegroundColor Gray
Write-Host "     • ID Karyawan: 82400944" -ForegroundColor Green
Write-Host "     • Password: 82400944K3" -ForegroundColor Green
Write-Host ""

Write-Host "5. Watch Console Logs" -ForegroundColor White
Write-Host "   You should see:" -ForegroundColor Gray
Write-Host "   - Attempting login..." -ForegroundColor Magenta
Write-Host "   - Login successful" -ForegroundColor Green
Write-Host "   - Login completed, redirecting..." -ForegroundColor Green
Write-Host "   - AuthenticatedLayout check" -ForegroundColor Cyan
Write-Host "   - AuthenticatedLayout rendering..." -ForegroundColor Green
Write-Host ""

Write-Host "Expected Result:" -ForegroundColor Yellow
Write-Host "   - Login notification appears" -ForegroundColor Green
Write-Host "   - Redirects to /dashboard" -ForegroundColor Green
Write-Host "   - Dashboard loads with sidebar" -ForegroundColor Green
Write-Host "   - User name shows: Admin User" -ForegroundColor Green
Write-Host "   - Refresh keeps you logged in" -ForegroundColor Green
Write-Host ""

Write-Host "Troubleshooting:" -ForegroundColor Yellow
Write-Host "   - Check console for error messages" -ForegroundColor Gray
Write-Host "   - Verify token in localStorage" -ForegroundColor Gray
Write-Host "   - Check Network tab for API calls" -ForegroundColor Gray
Write-Host "   - Read: TEST_LOGIN_DEBUG.md for details" -ForegroundColor Gray
Write-Host ""

Write-Host "Quick Links:" -ForegroundColor Yellow
Write-Host "   - Login: http://localhost:3000/login" -ForegroundColor Cyan
Write-Host "   - Dashboard: http://localhost:3000/dashboard" -ForegroundColor Cyan
Write-Host "   - Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "   - Debug Tool: debug-login.html" -ForegroundColor Cyan
Write-Host ""

Write-Host "Pro Tip:" -ForegroundColor Yellow
Write-Host "   Use TWO terminals side-by-side:" -ForegroundColor Gray
Write-Host "   - Left: Backend logs" -ForegroundColor Gray
Write-Host "   - Right: Frontend logs" -ForegroundColor Gray
Write-Host "   Watch both for errors!" -ForegroundColor Gray
Write-Host ""

# Test backend connection
Write-Host "Testing Backend Connection..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "   OK - Backend is RUNNING on port 3001" -ForegroundColor Green
} catch {
    Write-Host "   WARNING - Backend NOT running - Start it first!" -ForegroundColor Red
    Write-Host "      cd smk3-backend" -ForegroundColor Yellow
    Write-Host "      bun run start:dev" -ForegroundColor Yellow
}

# Test frontend connection
Write-Host "Testing Frontend Connection..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "   OK - Frontend is RUNNING on port 3000" -ForegroundColor Green
} catch {
    Write-Host "   WARNING - Frontend NOT running - Start it first!" -ForegroundColor Red
    Write-Host "      bun run dev" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "   Ready to test! Open Incognito and try login!        " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""
