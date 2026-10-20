import React, { useState } from 'react'
import { Info, ArrowRight } from 'lucide-react'
import '../pages/ProblemType1.css'

export const ProblemType3: React.FC = () => {
  const [inputCode, setInputCode] = useState('BCD')
  const [outputCode, setOutputCode] = useState('Excess-3')

  return (
    <div className="problem-type-1">
      <div className="problem-header">
        <h1 className="problem-title">
          <span className="problem-badge">Dạng 3</span>
          Thiết kế mạch chuyển mã
        </h1>
        <p className="problem-description">
          Áp dụng cho <strong>Câu 6, 7</strong>. Thiết kế mạch chuyển đổi mã (BCD, Gray, Excess-3, v.v.).
        </p>
      </div>

      <div className="step-content">
        <div className="info-box">
          <Info className="info-icon" />
          <div className="info-text">
            <strong>Hướng dẫn:</strong> Chọn loại mã đầu vào và đầu ra, công cụ sẽ tự động tạo bảng chuyển đổi
            và thiết kế mạch tương ứng.
          </div>
        </div>

        <div className="input-section">
          <h3 className="section-title">Cấu hình chuyển mã</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mã đầu vào:</label>
              <select
                className="form-select"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
              >
                <option value="BCD">BCD (8421)</option>
                <option value="Gray">Gray Code</option>
                <option value="Excess-3">Excess-3</option>
                <option value="Binary">Nhị phân thường</option>
                <option value="2421">2421 Code</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
              <ArrowRight className="step-arrow" style={{ width: 40, height: 40 }} />
            </div>

            <div className="form-group">
              <label className="form-label">Mã đầu ra:</label>
              <select
                className="form-select"
                value={outputCode}
                onChange={(e) => setOutputCode(e.target.value)}
              >
                <option value="Excess-3">Excess-3</option>
                <option value="Gray">Gray Code</option>
                <option value="BCD">BCD (8421)</option>
                <option value="Binary">Nhị phân thường</option>
                <option value="2421">2421 Code</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label className="form-label">Số bit:</label>
              <select className="form-select">
                <option value="4">4 bit (0-9 cho BCD)</option>
                <option value="3">3 bit (0-7)</option>
              </select>
            </div>
          </div>

          <div className="button-row">
            <button className="btn-primary">Tạo bảng chuyển đổi</button>
            <button className="btn-secondary">Đặt lại</button>
          </div>
        </div>

        <div className="result-note">
          <Info className="info-icon" />
          <div className="info-text">
            <strong>Đang phát triển:</strong> Tính năng này đang được hoàn thiện. Hiện tại bạn có thể sử dụng
            <strong> Dạng 1</strong> và nhập thủ công bảng chuyển đổi theo đề bài câu 6, 7.
          </div>
        </div>

        <div className="input-section" style={{ marginTop: '1.5rem' }}>
          <h3 className="section-title">Ví dụ bảng chuyển đổi BCD → Excess-3</h3>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9375rem'
          }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-secondary)' }}>
                <th style={{ padding: '0.75rem', border: '1px solid var(--color-border)' }}>Thập phân</th>
                <th style={{ padding: '0.75rem', border: '1px solid var(--color-border)' }}>BCD (Đầu vào)</th>
                <th style={{ padding: '0.75rem', border: '1px solid var(--color-border)' }}>Excess-3 (Đầu ra)</th>
              </tr>
            </thead>
            <tbody>
              {[
                [0, '0000', '0011'],
                [1, '0001', '0100'],
                [2, '0010', '0101'],
                [3, '0011', '0110'],
                [4, '0100', '0111'],
                [5, '0101', '1000'],
                [6, '0110', '1001'],
                [7, '0111', '1010'],
                [8, '1000', '1011'],
                [9, '1001', '1100'],
              ].map(([dec, bcd, ex3]) => (
                <tr key={dec}>
                  <td style={{ padding: '0.625rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>{dec}</td>
                  <td style={{ padding: '0.625rem', border: '1px solid var(--color-border)', textAlign: 'center', fontFamily: 'monospace' }}>{bcd}</td>
                  <td style={{ padding: '0.625rem', border: '1px solid var(--color-border)', textAlign: 'center', fontFamily: 'monospace' }}>{ex3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
