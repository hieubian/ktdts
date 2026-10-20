# Script tự động build và deploy
# Chạy: sh deploy.sh

echo "🚀 Bắt đầu build và deploy..."

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js chưa được cài đặt!"
    echo "Tải tại: https://nodejs.org/"
    exit 1
fi

# Kiểm tra npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm chưa được cài đặt!"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"

# Cài dependencies nếu chưa có
if [ ! -d "node_modules" ]; then
    echo "📦 Đang cài đặt dependencies..."
    npm install
fi

# Build project
echo "🔨 Đang build project..."
npm run build

# Kiểm tra build thành công
if [ ! -d "dist" ]; then
    echo "❌ Build thất bại! Kiểm tra lỗi ở trên."
    exit 1
fi

echo "✅ Build thành công!"

# Git add, commit, push
echo "📤 Đang push lên GitHub..."
git add .
git commit -m "build: deploy latest version

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main

echo "✅ Hoàn tất! Đợi 1-2 phút để GitHub Actions deploy."
echo "🌐 Truy cập: https://<username>.github.io/ktdts-solver/"
