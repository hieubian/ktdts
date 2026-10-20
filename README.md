# Giải Bài Tập KTĐTS | Kỹ thuật Điện tử Số

🎓 **Công cụ giải bài tập Kỹ thuật Điện tử Số** - Hỗ trợ đầy đủ các dạng bài trong chương 1, 2

---

## 🌟 Tính Năng Chính

### ✅ Hỗ trợ 4 Dạng Bài Tập

#### 📊 **Dạng 1 (Câu 1-3): Rút gọn hàm Boolean**
- Rút gọn hàm logic bằng bìa Karnaugh (2, 3, 4 biến)
- Hỗ trợ SOP và POS
- Tự động tìm các nhóm khoanh tối ưu
- Hiển thị từng bước biến đổi đại số Boolean
- Vẽ sơ đồ mạch logic (AND/OR/NOT, NAND, NOR)

#### 🔧 **Dạng 2 (Câu 4-5): Thiết kế mạch theo quy tắc**
- Thiết kế mạch tổ hợp theo quy tắc logic cụ thể
- VD: Y=1 khi tổng chia hết cho 2 hoặc 5
- Tự động tạo bảng chân trị theo quy tắc

#### 🔄 **Dạng 3 (Câu 6-7): Mạch chuyển mã**
- Thiết kế mạch chuyển đổi mã (BCD, Gray, Excess-3, 2421)
- Tạo bảng chuyển đổi tự động
- Rút gọn từng đầu ra

#### 💡 **Dạng 4 (Câu 8-9): LED 7 đoạn**
- Thiết kế mạch decoder BCD sang LED 7 đoạn
- Hỗ trợ Catốt chung và Anốt chung
- Preset cho các bài tập phổ biến (56789AEdPH, 123456789A, v.v.)
- Tùy chỉnh các ký tự và thanh LED cần thiết kế

---

## 🚀 Cài Đặt & Chạy

### Yêu cầu
- **Node.js** >= 18.0.0
- **npm**, **pnpm**, hoặc **yarn**

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd ktdts
```

### Bước 2: Cài đặt dependencies
```bash
npm install
# hoặc
pnpm install
```

### Bước 3: Chạy môi trường development
```bash
npm run dev
```

Truy cập: `http://localhost:5173`

### Bước 4: Build production
```bash
npm run build
```

Các file build sẽ nằm trong thư mục `dist/`

---

## 🎯 Hướng Dẫn Sử Dụng

### Nhập Dữ Liệu

#### 1. Theo Minterm/Maxterm
```
0, 2, 3, 5, 7, 9, 11, 13, 15
```

#### 2. Theo Biểu Thức Boolean
- `A'B + BC'D` (dấu nháy phủ định)
- `!A*B + C` (dấu ! và *)
- `AB + C` (viết liền)

#### 3. Nhập Trực Tiếp
- Nhấp vào ô trong bìa Karnaugh
- Chuyển đổi: `0 → 1 → d (don't care) → 0`

---

## 🎨 Giao Diện

### Thiết kế thân thiện, dễ dùng cho người mới
- ✅ Hướng dẫn từng bước rõ ràng
- ✅ Phân loại 4 dạng bài tách biệt
- ✅ Giao diện màu sắc bắt mắt, dễ nhìn
- ✅ Responsive - hoạt động tốt trên mọi thiết bị
- ✅ Hỗ trợ in PDF để nộp bài

---

## 🛠️ Công Nghệ Sử Dụng

- **React 18** - Thư viện UI
- **TypeScript** - Type safety
- **Vite** - Build tool cực nhanh
- **KaTeX** - Hiển thị công thức toán học đẹp
- **Lucide React** - Bộ icon đẹp và nhẹ

---

## 📝 Lưu Ý Quan Trọng

⚠️ **Công cụ này chỉ hỗ trợ THAM KHẢO cách giải**. Hãy hiểu rõ từng bước để tự làm lại khi thi.

⚠️ **Kết quả có thể khác với đáp án** nếu có nhiều cách rút gọn tương đương (nhưng kết quả luôn đúng về mặt logic).

---

## 🤝 Đóng Góp

Mọi đóng góp đều được hoan nghênh! Hãy tạo issue hoặc pull request.

### Quy trình đóng góp
1. Fork repository
2. Tạo branch mới: `git checkout -b feature/tinh-nang-moi`
3. Commit: `git commit -m "feat: mô tả tính năng"`
4. Push: `git push origin feature/tinh-nang-moi`
5. Tạo Pull Request

---

## 📄 Giấy Phép

MIT License - Tự do sử dụng cho mục đích học tập và nghiên cứu.

---

## 👨‍💻 Tác Giả

**Phát triển bởi Claude & bạn**

Dự án này được xây dựng để hỗ trợ sinh viên học tập môn Kỹ thuật Điện tử Số hiệu quả hơn.

---

## 🎓 Tài Liệu Tham Khảo

- Slide bài giảng KTĐTS
- Bài tập KTDTSO Chương 1, 2
- Đề cương ôn tập Kỹ thuật Điện tử Số

---

**Happy Learning! 🚀📚**
