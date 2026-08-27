# Test Login Frontend Script
# Test apakah login flow frontend berfungsi dengan benar

Write-Host "🧪 Testing Login Flow..." -ForegroundColor Cyan
Write-Host ""

# 1. Test Backend API
Write-Host "1️⃣ Testing Backend API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"idKaryawan": "82400944", "password": "82400944K3"}' `
        -UseBasicParsing
    
    Write-Host "✅ Backend API Working!" -ForegroundColor Green
    Write-Host "   User: $($response.user.nama)" -ForegroundColor Gray
    Write-Host "   Role: $($response.user.role)" -ForegroundColor Gray
    Write-Host "   Token: $($response.token.Substring(0,50))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Backend API Error: $_" -ForegroundColor Red
    Write-Host "   Make sure backend is running: cd smk3-backend && bun run start:dev" -ForegroundColor Yellow
    exit 1
}

# 2. Test Frontend Accessible
Write-Host "2️⃣ Testing Frontend Server..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend Server Running!" -ForegroundColor Green
        Write-Host ""
    }
} catch {
    Write-Host "❌ Frontend Server Error: $_" -ForegroundColor Red
    Write-Host "   Make sure frontend is running: bun run dev" -ForegroundColor Yellow
    exit 1
}

# 3. Show Login Instructions
Write-Host "3️⃣ Manual Test Instructions:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   🌐 Open: http://localhost:3000/login" -ForegroundColor Cyan
Write-Host ""
Write-Host "   📝 Test Credentials:" -ForegroundColor White
Write-Host "      Admin:"
Write-Host "        ID Karyawan: 82400944" -ForegroundColor Green
Write-Host "        Password: 82400944K3" -ForegroundColor Green
Write-Host ""
Write-Host "      Supervisor:"
Write-Host "        ID Karyawan: 82400469" -ForegroundColor Cyan
Write-Host "        Password: 82400469K3" -ForegroundColor Cyan
Write-Host ""
Write-Host "      User:"
Write-Host "        ID Karyawan: 82400945" -ForegroundColor Magenta
Write-Host "        Password: 82400945K3" -ForegroundColor Magenta
Write-Host ""

# 4. What to check
Write-Host "4️⃣ Checklist After Login:" -ForegroundColor Yellow
Write-Host "   ☐ No errors in browser console (F12)" -ForegroundColor Gray
Write-Host "   ☐ Redirects to /dashboard automatically" -ForegroundColor Gray
Write-Host "   ☐ Token stored in localStorage (smk3_token)" -ForegroundColor Gray
Write-Host "   ☐ User name displayed in header/navbar" -ForegroundColor Gray
Write-Host "   ☐ Can navigate to other pages" -ForegroundColor Gray
Write-Host "   ☐ Refresh page keeps user logged in" -ForegroundColor Gray
Write-Host ""

Write-Host "✨ Ready to test! Open browser and try login." -ForegroundColor Green
Write-Host ""
