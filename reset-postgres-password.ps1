# Script untuk Reset Password PostgreSQL
# Jalankan script ini sebagai Administrator

Write-Host "=== Reset Password PostgreSQL ===" -ForegroundColor Cyan
Write-Host ""

$pgVersion = "18"
$pgDataPath = "C:\Program Files\PostgreSQL\$pgVersion\data"
$pgHbaFile = "$pgDataPath\pg_hba.conf"
$serviceName = "postgresql-x64-$pgVersion"

# Backup pg_hba.conf
Write-Host "1. Membuat backup pg_hba.conf..." -ForegroundColor Yellow
Copy-Item $pgHbaFile "$pgHbaFile.backup" -Force
Write-Host "   Backup dibuat: $pgHbaFile.backup" -ForegroundColor Green

# Ubah authentication method ke trust
Write-Host ""
Write-Host "2. Mengubah authentication method ke 'trust'..." -ForegroundColor Yellow
$content = Get-Content $pgHbaFile
$newContent = $content -replace 'scram-sha-256', 'trust'
$newContent | Set-Content $pgHbaFile
Write-Host "   Authentication method diubah" -ForegroundColor Green

# Restart PostgreSQL service
Write-Host ""
Write-Host "3. Restart PostgreSQL service..." -ForegroundColor Yellow
try {
    Restart-Service $serviceName -Force
    Start-Sleep -Seconds 3
    Write-Host "   Service berhasil di-restart" -ForegroundColor Green
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

# Set password baru
Write-Host ""
Write-Host "4. Mengatur password baru..." -ForegroundColor Yellow
$newPassword = "jakarta123"
$psqlPath = "C:\Program Files\PostgreSQL\$pgVersion\bin\psql.exe"

try {
    & $psqlPath -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD '$newPassword';"
    Write-Host "   Password berhasil diubah menjadi: $newPassword" -ForegroundColor Green
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

# Kembalikan authentication method
Write-Host ""
Write-Host "5. Mengembalikan authentication method ke 'scram-sha-256'..." -ForegroundColor Yellow
$content = Get-Content $pgHbaFile
$newContent = $content -replace 'trust', 'scram-sha-256'
$newContent | Set-Content $pgHbaFile
Write-Host "   Authentication method dikembalikan" -ForegroundColor Green

# Restart service lagi
Write-Host ""
Write-Host "6. Restart PostgreSQL service sekali lagi..." -ForegroundColor Yellow
try {
    Restart-Service $serviceName -Force
    Start-Sleep -Seconds 3
    Write-Host "   Service berhasil di-restart" -ForegroundColor Green
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

# Test koneksi
Write-Host ""
Write-Host "7. Testing koneksi dengan password baru..." -ForegroundColor Yellow
$env:PGPASSWORD = $newPassword
try {
    $result = & $psqlPath -U postgres -d postgres -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   Koneksi berhasil!" -ForegroundColor Green
        Write-Host ""
        Write-Host "=== SELESAI ===" -ForegroundColor Cyan
        Write-Host "Password PostgreSQL sekarang: $newPassword" -ForegroundColor Green
    } else {
        Write-Host "   Koneksi gagal" -ForegroundColor Red
    }
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Tekan Enter untuk keluar..."
Read-Host
