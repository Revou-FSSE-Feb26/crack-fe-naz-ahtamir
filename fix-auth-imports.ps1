# PowerShell script untuk replace useSession dengan useAuth
# Run this in PowerShell: .\fix-auth-imports.ps1

Write-Host "🔄 Fixing NextAuth imports to AuthContext..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts" | 
    Where-Object { 
        $_.FullName -notmatch "node_modules" -and 
        $_.FullName -notmatch ".next" -and
        $_.FullName -notmatch "AuthContext" 
    }

$count = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Check if file uses next-auth/react
    if ($content -match 'next-auth/react') {
        Write-Host "📝 Updating: $($file.Name)" -ForegroundColor Yellow
        
        # Replace import statement
        $content = $content -replace 'import\s+\{[^}]*useSession[^}]*\}\s+from\s+[''"]next-auth/react[''"];?', 'import { useAuth } from "@/contexts/AuthContext";'
        
        # Replace useSession() call pattern 1: const { data: session, status } = useSession();
        $content = $content -replace 'const\s+\{\s*data:\s*session,?\s*status\s*\}\s*=\s*useSession\(\);?', 'const { user, isAuthenticated, isLoading } = useAuth();'
        
        # Replace useSession() call pattern 2: const { data: session } = useSession();
        $content = $content -replace 'const\s+\{\s*data:\s*session\s*\}\s*=\s*useSession\(\);?', 'const { user, isAuthenticated } = useAuth();'
        
        # Replace session usage patterns
        $content = $content -replace 'session\?.user\?.name', 'user?.name'
        $content = $content -replace 'session\?.user\?.email', 'user?.email'
        $content = $content -replace 'session\?.user\?.role', 'user?.role'
        $content = $content -replace '\(session\?.user as any\)\?\.role', 'user?.role'
        $content = $content -replace 'status === [''"]authenticated[''"]', 'isAuthenticated'
        $content = $content -replace 'status === [''"]loading[''"]', 'isLoading'
        $content = $content -replace 'status === [''"]unauthenticated[''"]', '!isAuthenticated && !isLoading'
        
        # Only write if content changed
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            $count++
        }
    }
}

Write-Host ""
Write-Host "✅ Fixed $count files" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Manual review needed for:" -ForegroundColor Yellow
Write-Host "   - Complex session usage patterns" -ForegroundColor Gray
Write-Host "   - signIn/signOut function calls" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review changed files" -ForegroundColor White
Write-Host "2. Test login flow" -ForegroundColor White
Write-Host "3. Test protected pages" -ForegroundColor White
