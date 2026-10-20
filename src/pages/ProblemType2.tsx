import React, { useState } from 'react'
import { Info, Lightbulb } from 'lucide-react'
import '../pages/ProblemType1.css'

export const ProblemType2: React.FC = () => {
  const [ruleDescription, setRuleDescription] = useState('')

  return (
    <div className="problem-type-1">
      <div className="problem-header">
        <h1 className="problem-title">
          <span className="problem-badge">Dạng 2</span>
          Thiết kế mạch theo quy tắc logic
        </h1>
        <p className="problem-description">
          Áp dụng cho <strong>Câu 4, 5</strong>. Thiết kế mạch tổ hợp theo quy tắc cụ thể (VD: Y=1 khi tổng chia hết cho 2 hoặc 5).
        </p>
      </div>

      <div className="step-content">
        <div className="info-box">
          <Info className="info-icon" />
          <div className="info-text">
            <strong>Hướng dẫn:</strong> Nhập quy tắc logic (ví dụ: "Y=1 khi tổng A+B+C+D chia hết cho 2 hoặc 5"),
            công cụ sẽ tự động tạo bảng chân trị và rút gọn hàm.
          </div>
        </div>

        <div className="input-section">
          <h3 className="section-title">Nhập quy tắc</h3>

          <div className="form-row">
            <div className="form-group full-width">
              <label className="form-label">Mô tả quy tắc:</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="VD: Y = 1 khi tổng các bit đầu vào chia hết cho 2 hoặc 5"
                value={ruleDescription}
                onChange={(e) => setRuleDescription(e.target.value)}
                style={{ resize: 'vertical' }}
              />
              <small className="form-hint">
                Nhập mô tả quy tắc logic theo đề bài (câu 4, 5)
              </small>
            </div>
          </div>

          <div className="info-box">
            <Lightbulb className="info-icon" />
            <div className="info-text">
              <strong>Các dạng quy tắc phổ biến:</strong>
              <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                <li>Y = 1 khi tổng (A+B+C+D) chia hết cho 2 hoặc 5</li>
                <li>Y = 1 khi số bit 1 trong đầu vào là số lẻ</li>
                <li>Y = 1 khi giá trị thập phân của đầu vào là số nguyên tố</li>
                <li>Y = 1 khi giá trị nhị phân lớn hơn 7</li>
              </ul>
            </div>
          </div>

          <div className="button-row">
            <button className="btn-primary">Áp dụng quy tắc</button>
            <button className="btn-secondary">Xóa</button>
          </div>
        </div>

        <div className="result-note">
          <Info className="info-icon" />
          <div className="info-text">
            <strong>Đang phát triển:</strong> Tính năng này đang được hoàn thiện. Hiện tại bạn có thể sử dụng
            <strong> Dạng 1</strong> để nhập thủ công các minterm theo quy tắc của đề bài.
          </div>
        </div>
      </div>
    </div>
  )
}
