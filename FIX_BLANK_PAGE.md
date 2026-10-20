# 🔧 Hướng Dẫn Sửa Lỗi Trắng Trang

## ❌ Nguyên Nhân Trắng Trang

Khi trỏ tên miền vào GitHub Pages mà trang trắng, có 3 nguyên nhân chính:

### 1. **Chưa build project** (quan trọng nhất!)
- Dự án chưa chạy `npm run build`
- Không có thư mục `dist/` để deploy
- GitHub Actions chưa chạy hoặc đang lỗi

### 2. **Sai `base` path trong vite.config.ts**
- **GitHub Pages default**: `base: '/ktdts-solver/'`
- **Custom domain**: `base: '/'`
- Nếu sai sẽ không tìm được file CSS/JS

### 3. **TypeScript có lỗi**
- Build script cũ: `tsc -b && vite build`
- Nếu TS lỗi → dừng → không có dist/

---

## ✅ Cách Sửa (3 Bước)

### **Bước 1: Cài đặt dependencies**

```bash
cd D:\1HY4\"Ky thuat dien tu so"\baoboi\ktdts
npm install
```

⏳ Đợi 2-3 phút để tải về các thư viện (React, Vite, TypeScript, KaTeX,...)

---

### **Bước 2: Build dự án**

```bash
npm run build
```

✅ Nếu thành công, bạn sẽ thấy thư mục `dist/` được tạo với các file HTML, CSS, JS

❌ Nếu lỗi, đọc thông báo và sửa (hoặc dùng `npm run build:tsc` để bỏ qua TS check)

---

### **Bước 3: Commit và Push lên GitHub**

```bash
git add .
git commit -m "fix: build project and fix base path for custom domain"
git push origin main
```

GitHub Actions sẽ tự động deploy trong 1-2 phút.

---

## 🔍 Kiểm Tra GitHub Actions

1. Vào GitHub repo: `https://github.com/<username>/ktdts-solver`
2. Tab **Actions**
3. Xem workflow **Deploy to GitHub Pages**
4. Nếu có dấu ❌ đỏ → click vào xem lỗi
5. Nếu có dấu ✅ xanh → đã deploy thành công

---

## 🌐 Cấu Hình Custom Domain

### **Tại GitHub:**

1. Repo **Settings** → **Pages**
2. **Custom domain**: Nhập tên miền của bạn (VD: `ktdts.example.com`)
3. **Enforce HTTPS**: Bật (đợi vài phút để GitHub cấp SSL)

### **Tại nhà cung cấp tên miền (VD: GoDaddy, Namecheap):**

#### Cách 1: Subdomain (khuyến nghị)
```
Type: CNAME
Name: ktdts (hoặc www)
Value: <username>.github.io
TTL: 3600
```

#### Cách 2: Domain gốc (apex)
```
Type: A
Name: @
Value: 185.199.108.153
```
```
Type: A
Name: @
Value: 185.199.109.153
```
```
Type: A
Name: @
Value: 185.199.110.153
```
```
Type: A
Name: @
Value: 185.199.111.153
```

⏳ Đợi 5-30 phút để DNS cập nhật

---

## 🚀 Phương Án Thay Thế: Vercel (Dễ Hơn!)

**Vercel** dễ hơn GitHub Pages cho custom domain:

### Bước 1: Import vào Vercel

1. Truy cập: https://vercel.com/signup
2. Đăng nhập bằng GitHub
3. **New Project** → Chọn repo `ktdts-solver`
4. **Framework Preset**: Vite
5. **Deploy**

⏳ Đợi 1-2 phút

### Bước 2: Trỏ tên miền

1. Vercel **Settings** → **Domains**
2. Nhập tên miền → **Add**
3. Vercel sẽ hiển thị DNS cần cấu hình
4. Thêm record vào nhà cung cấp tên miền:
   ```
   Type: CNAME
   Name: ktdts (hoặc www)
   Value: cname.vercel-dns.com
   ```

✅ Vercel tự động cấp SSL và tối ưu tốc độ

---

## 🧪 Test Build Local Trước Khi Push

```bash
# Build
npm run build

# Test bản build
npm run preview
```

Mở: `http://localhost:4173`

Nếu chạy tốt local → push lên GitHub sẽ OK!

---

## 🛠️ Debug Nâng Cao

### Kiểm tra file build:

```bash
ls dist/
```

Bạn phải thấy:
- `index.html`
- `assets/` (chứa CSS và JS)
- `favicon.svg`

### Xem nội dung index.html:

```bash
cat dist/index.html
```

Kiểm tra đường dẫn asset:
- ✅ Đúng: `<script src="/assets/index-abc123.js">`
- ❌ Sai: `<script src="/ktdts-solver/assets/index-abc123.js">` (khi dùng custom domain)

---

## 📞 Checklist Hoàn Chỉnh

- [ ] Đã cài Node.js (>= 18.0)
- [ ] Đã chạy `npm install`
- [ ] Đã chạy `npm run build` thành công
- [ ] Đã có thư mục `dist/`
- [ ] Đã push code lên GitHub
- [ ] GitHub Actions chạy thành công (✅ xanh)
- [ ] Đã cấu hình Custom Domain đúng
- [ ] Đã thêm DNS record đúng
- [ ] Đã đợi DNS cập nhật (5-30 phút)
- [ ] Đã bật HTTPS tại GitHub Pages

---

## 💡 Mẹo Hay

### 1. Clear cache trình duyệt
Sau khi deploy, nhấn `Ctrl+Shift+R` (hoặc `Cmd+Shift+R` trên Mac) để tải lại trang không dùng cache.

### 2. Kiểm tra bằng DevTools
- F12 → Tab **Console**
- Xem có lỗi 404 (không tìm thấy file) không
- Tab **Network** → xem file nào bị lỗi load

### 3. Test bằng GitHub Pages URL trước
Trước khi trỏ custom domain, test với URL GitHub Pages mặc định:
```
https://<username>.github.io/ktdts-solver/
```

Nếu chạy được → vấn đề nằm ở DNS
Nếu vẫn trắng → vấn đề nằm ở build

---

## ❓ FAQ

**Q: Tại sao sau khi push vẫn trắng?**
A: Đợi GitHub Actions chạy xong (1-2 phút), sau đó clear cache trình duyệt.

**Q: Lỗi "Page build failed"?**
A: Kiểm tra GitHub Actions logs để xem lỗi cụ thể. Thường do build script lỗi.

**Q: Tại sao chỉ có trang chủ, chuyển tab bị lỗi?**
A: GitHub Pages cần file `_redirects` hoặc cấu hình 404 fallback. Vercel xử lý tự động nên dễ hơn.

**Q: DNS đã đợi lâu nhưng vẫn không được?**
A: Dùng https://dnschecker.org để kiểm tra DNS đã lan truyền chưa.

---

**Chúc bạn deploy thành công! 🎉**

Nếu vẫn gặp vấn đề, gửi screenshot lỗi để được hỗ trợ cụ thể hơn.
