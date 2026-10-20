# 🚀 Hướng Dẫn Cài Đặt và Upload lên GitHub

## Bước 1: Cài đặt Node.js (nếu chưa có)

1. Truy cập: https://nodejs.org/
2. Tải phiên bản **LTS** (khuyến nghị)
3. Cài đặt theo hướng dẫn
4. Kiểm tra: Mở PowerShell và chạy:
   ```powershell
   node --version
   npm --version
   ```

## Bước 2: Cài đặt dependencies

Mở PowerShell tại thư mục `ktdts` và chạy:

```powershell
npm install
```

⏳ Quá trình này sẽ mất vài phút để tải về các thư viện cần thiết.

## Bước 3: Chạy thử dự án

```powershell
npm run dev
```

🌐 Mở trình duyệt và truy cập: **http://localhost:5173**

Nếu mọi thứ hoạt động tốt, bạn sẽ thấy giao diện ứng dụng!

## Bước 4: Build cho production

```powershell
npm run build
```

Các file build sẽ nằm trong thư mục `dist/`

## Bước 5: Upload lên GitHub

### 5.1. Khởi tạo Git repository

```powershell
cd D:\1HY4\"Ky thuat dien tu so"\baoboi\ktdts
git init
git add .
git commit -m "Initial commit: KTDTS Solver App"
```

### 5.2. Tạo repository trên GitHub

1. Truy cập: https://github.com/new
2. Đặt tên repository: `ktdts-solver`
3. Chọn **Public** (để deploy miễn phí)
4. **KHÔNG** chọn "Initialize with README" (vì đã có sẵn)
5. Nhấn **Create repository**

### 5.3. Push code lên GitHub

Sau khi tạo repo, GitHub sẽ hiển thị hướng dẫn. Chạy các lệnh:

```powershell
git remote add origin https://github.com/<username>/ktdts-solver.git
git branch -M main
git push -u origin main
```

Thay `<username>` bằng tên GitHub của bạn.

## Bước 6: Deploy lên Vercel (Miễn phí)

### 6.1. Tạo tài khoản Vercel

1. Truy cập: https://vercel.com/signup
2. Đăng nhập bằng GitHub

### 6.2. Import project

1. Nhấn **Add New** → **Project**
2. Chọn repository `ktdts-solver`
3. **Framework Preset**: Vite
4. Nhấn **Deploy**

⏳ Chờ 1-2 phút để build và deploy

### 6.3. Trỏ tên miền

Sau khi deploy xong, Vercel sẽ cung cấp domain miễn phí:
```
https://ktdts-solver-<random>.vercel.app
```

Để trỏ tên miền riêng:

1. Vào **Settings** → **Domains**
2. Nhập tên miền của bạn
3. Cấu hình DNS theo hướng dẫn của Vercel

---

## 🔧 Lệnh Hữu Ích

```powershell
# Chạy development server
npm run dev

# Build production
npm run build

# Preview bản build
npm run preview

# Lint code
npm run lint
```

---

## ❓ Khắc Phục Lỗi Thường Gặp

### Lỗi: "npm: command not found"
→ Chưa cài Node.js hoặc chưa thêm vào PATH. Cài lại Node.js.

### Lỗi: Port 5173 đã được sử dụng
→ Dừng ứng dụng khác đang chạy trên port đó, hoặc Vite sẽ tự động chọn port khác.

### Lỗi khi build: "module not found"
→ Chạy lại: `npm install`

### Lỗi Git: "fatal: not a git repository"
→ Chạy: `git init` trước

---

## 📞 Liên Hệ & Hỗ Trợ

Nếu gặp vấn đề, tạo issue trên GitHub hoặc liên hệ trực tiếp.

**Chúc bạn thành công! 🎉**
