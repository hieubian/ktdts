import React from 'react'
import { X, BookOpen, Lightbulb, Zap, Target } from 'lucide-react'
import './HelpModal.css'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <BookOpen className="modal-icon" />
            <h2>Hướng dẫn sử dụng</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="modal-body">
          <section className="help-section">
            <div className="help-section-header">
              <Target className="help-icon" />
              <h3>4 Dạng Bài Tập Chính</h3>
            </div>
            <div className="help-content">
              <div className="help-item">
                <strong>Dạng 1 (Câu 1-3):</strong> Rút gọn hàm Boolean, vẽ mạch logic cơ bản và
                chuyển đổi sang NAND/NOR.
              </div>
              <div className="help-item">
                <strong>Dạng 2 (Câu 4-5):</strong> Thiết kế mạch theo quy tắc logic cụ thể (ví dụ:
                Y=1 khi tổng chia hết cho 2 hoặc 5).
              </div>
              <div className="help-item">
                <strong>Dạng 3 (Câu 6-7):</strong> Thiết kế mạch chuyển mã (BCD sang Excess-3,
                Gray, v.v.).
              </div>
              <div className="help-item">
                <strong>Dạng 4 (Câu 8-9):</strong> Thiết kế mạch điều khiển LED 7 đoạn (Catốt/Anốt
                chung).
              </div>
            </div>
          </section>

          <section className="help-section">
            <div className="help-section-header">
              <Lightbulb className="help-icon" />
              <h3>Cách Nhập Liệu</h3>
            </div>
            <div className="help-content">
              <div className="help-item">
                <strong>Minterm/Maxterm:</strong> Nhập danh sách số phân tách bằng dấu phẩy, ví
                dụ: <code>0, 2, 5, 7, 11</code>
              </div>
              <div className="help-item">
                <strong>Biểu thức Boolean:</strong> Hỗ trợ nhiều dạng:
                <ul>
                  <li><code>A'B + BC'D</code> (dấu nháy phủ định)</li>
                  <li><code>!A*B + C</code> (dấu ! và *)</li>
                  <li><code>AB + C</code> (viết liền)</li>
                </ul>
              </div>
              <div className="help-item">
                <strong>Don't Care:</strong> Nhập riêng hoặc đánh dấu trực tiếp trên bảng Karnaugh
              </div>
            </div>
          </section>

          <section className="help-section">
            <div className="help-section-header">
              <Zap className="help-icon" />
              <h3>Các Tính Năng</h3>
            </div>
            <div className="help-content">
              <div className="help-item">
                ✅ Tự động tìm các nhóm khoanh tối ưu trên bảng Karnaugh
              </div>
              <div className="help-item">
                ✅ Hiển thị từng bước biến đổi đại số Boolean (De Morgan, bù kép)
              </div>
              <div className="help-item">
                ✅ Vẽ sơ đồ mạch logic (AND/OR/NOT, NAND, NOR)
              </div>
              <div className="help-item">✅ Hỗ trợ in ra PDF để nộp bài hoặc học</div>
              <div className="help-item">
                ✅ Giao diện thân thiện, hướng dẫn từng bước cho người mới
              </div>
            </div>
          </section>

          <section className="help-section">
            <div className="help-section-header">
              <BookOpen className="help-icon" />
              <h3>Lưu Ý Quan Trọng</h3>
            </div>
            <div className="help-content">
              <div className="help-item alert-warning">
                Công cụ này chỉ hỗ trợ THAM KHẢO cách giải. Hãy hiểu rõ từng bước để tự làm lại khi
                thi.
              </div>
              <div className="help-item alert-info">
                Kết quả có thể khác với đáp án nếu có nhiều cách rút gọn tương đương.
              </div>
            </div>
          </section>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Đã hiểu, bắt đầu làm bài
          </button>
        </div>
      </div>
    </div>
  )
}
