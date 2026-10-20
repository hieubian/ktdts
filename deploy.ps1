# Script tự động build và deploy cho Windows
# Chạy: .\deploy.ps1
# Nếu lỗi policy: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

Write-Host "🚀 Bắt đầu build và deploy..." -ForegroundColor Green

# Kiểm tra Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js chưa được cài đặt!" -ForegroundColor Red
    Write-Host "Tải tại: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Kiểm tra npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm chưa được cài đặt!" -ForegroundColor Red
    exit 1
}

# Cài dependencies nếu chưa có
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Đang cài đặt dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Cài đặt dependencies thất bại!" -ForegroundColor Red
        exit 1
    }
}

# Build project
Write-Host "🔨 Đang build project..." -ForegroundColor Yellow
npm run build

# Kiểm tra build thành công
if (-not (Test-Path "dist")) {
    Write-Host "❌ Build thất bại! Kiểm tra lỗi ở trên." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build thành công!" -ForegroundColor Green

# Git add, commit, push
Write-Host "📤 Đang push lên GitHub..." -ForegroundColor Yellow
git add .
git commit -m "build: deploy latest version

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Hoàn tất! Đợi 1-2 phút để GitHub Actions deploy." -ForegroundColor Green
    Write-Host "🌐 Truy cập: https://<username>.github.io/ktdts-solver/" -ForegroundColor Cyan
} else {
    Write-Host "❌ Push thất bại! Kiểm tra git config." -ForegroundColor Red
}
