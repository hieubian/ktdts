import React, { useState, useMemo } from 'react'
import './ProblemType1.css'
import { getVariableNames, solveKMap } from '../utils/kmapSolver'
import type { CellValue, OptimizationForm, VariableCount } from '../types'
import { KaTeXView } from '../components/KaTeXView'
import { KMapGrid } from '../components/KMapGrid'
import { CheckCircle2, Info, Lightbulb, ArrowRight } from 'lucide-react'

export const ProblemType1: React.FC = () => {
  const [variableCount, setVariableCount] = useState<VariableCount>(4)
  const [form, setForm] = useState<OptimizationForm>('SOP')
  const [activeStep, setActiveStep] = useState<'input' | 'kmap' | 'result'>('input')
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)

  const [gridValues, setGridValues] = useState<Record<number, CellValue>>(() => {
    const initial: Record<number, CellValue> = {}
    for (let i = 0; i < 16; i++) initial[i] = 0
    return initial
  })

  const [inputMode, setInputMode] = useState<'minterms' | 'expression' | 'manual'>('minterms')
  const [mintermInput, setMintermInput] = useState<string>('')
  const [dontCareInput, setDontCareInput] = useState<string>('')
  const [expressionInput, setExpressionInput] = useState<string>('')

  const variables = useMemo(() => getVariableNames(variableCount), [variableCount])

  const { groups, simplifiedLatex, simplifiedPlain } = useMemo(() => {
    return solveKMap(variableCount, gridValues, form)
  }, [variableCount, gridValues, form])

  const handleVariableCountChange = (newCount: VariableCount) => {
    setVariableCount(newCount)
    const total = 1 << newCount
    setGridValues((prev) => {
      const next: Record<number, CellValue> = {}
      for (let i = 0; i < total; i++) {
        next[i] = prev[i] ?? 0
      }
      return next
    })
  }

  const handleCellToggle = (minterm: number) => {
    setGridValues((prev) => {
      const current = prev[minterm] ?? 0
      let next: CellValue = 0
      if (current === 0) next = 1
      else if (current === 1) next = 'd'
      else next = 0
      return { ...prev, [minterm]: next }
    })
  }

  const parseNumberList = (input: string): number[] => {
    if (!input || !input.trim()) return []
    const matches = input.match(/\d+/g)
    if (!matches) return []
    return Array.from(new Set(matches.map(Number))).sort((a, b) => a - b)
  }

  const handleApplyMinterms = () => {
    const total = 1 << variableCount
    const next: Record<number, CellValue> = {}
    const defaultVal: CellValue = form === 'SOP' ? 0 : 1
    const targetVal: CellValue = form === 'SOP' ? 1 : 0

    for (let i = 0; i < total; i++) {
      next[i] = defaultVal
    }

    const minterms = parseNumberList(mintermInput)
    const dontCares = parseNumberList(dontCareInput)

    for (const t of minterms) {
      if (t < total) next[t] = targetVal
    }
    for (const d of dontCares) {
      if (d < total) next[d] = 'd'
    }

    setGridValues(next)
  }

  const handleClear = () => {
    const total = 1 << variableCount
    const next: Record<number, CellValue> = {}
    const defaultVal: CellValue = form === 'SOP' ? 0 : 1
    for (let i = 0; i < total; i++) {
      next[i] = defaultVal
    }
    setGridValues(next)
    setMintermInput('')
    setDontCareInput('')
    setExpressionInput('')
  }

  const handleSetAll = (val: CellValue) => {
    const total = 1 << variableCount
    const next: Record<number, CellValue> = {}
    for (let i = 0; i < total; i++) {
      next[i] = val
    }
    setGridValues(next)
  }

  return (
    <div className="problem-type-1">
      {/* Header */}
      <div className="problem-header">
        <h1 className="problem-title">
          <span className="problem-badge">Dạng 1</span>
          Rút gọn hàm Boolean bằng bìa Karnaugh
        </h1>
        <p className="problem-description">
          Áp dụng cho <strong>Câu 1, 2, 3</strong> trong đề bài tập. Rút gọn hàm logic và dựng sơ đồ mạch tương ứng.
        </p>
      </div>

      {/* Step Navigation */}
      <div className="step-navigator">
        <button
          className={`step-btn ${activeStep === 'input' ? 'active' : ''}`}
          onClick={() => setActiveStep('input')}
        >
          <span className="step-number">1</span>
          <span className="step-label">Nhập dữ kiện</span>
        </button>
        <ArrowRight className="step-arrow" />
        <button
          className={`step-btn ${activeStep === 'kmap' ? 'active' : ''}`}
          onClick={() => setActiveStep('kmap')}
        >
          <span className="step-number">2</span>
          <span className="step-label">Bìa Karnaugh</span>
        </button>
        <ArrowRight className="step-arrow" />
        <button
          className={`step-btn ${activeStep === 'result' ? 'active' : ''}`}
          onClick={() => setActiveStep('result')}
        >
          <span className="step-number">3</span>
          <span className="step-label">Kết quả</span>
        </button>
      </div>

      {/* Step 1: Input */}
      {activeStep === 'input' && (
        <div className="step-content">
          <div className="info-box">
            <Info className="info-icon" />
            <div className="info-text">
              <strong>Hướng dẫn:</strong> Chọn số biến và nhập các minterm (hoặc biểu thức) để bắt đầu rút gọn hàm Boolean.
            </div>
          </div>

          <div className="input-section">
            <h3 className="section-title">Cài đặt cơ bản</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Số biến:</label>
                <select
                  className="form-select"
                  value={variableCount}
                  onChange={(e) => handleVariableCountChange(Number(e.target.value) as VariableCount)}
                >
                  <option value={2}>2 biến (A, B)</option>
                  <option value={3}>3 biến (A, B, C)</option>
                  <option value={4}>4 biến (A, B, C, D)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Dạng tối thiểu:</label>
                <select
                  className="form-select"
                  value={form}
                  onChange={(e) => setForm(e.target.value as OptimizationForm)}
                >
                  <option value="SOP">SOP (Sum of Products)</option>
                  <option value="POS">POS (Product of Sums)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phương thức nhập:</label>
                <select
                  className="form-select"
                  value={inputMode}
                  onChange={(e) => setInputMode(e.target.value as 'minterms' | 'expression' | 'manual')}
                >
                  <option value="minterms">Theo minterm</option>
                  <option value="expression">Theo biểu thức</option>
                  <option value="manual">Nhập trực tiếp trên K-Map</option>
                </select>
              </div>
            </div>
          </div>

          {inputMode === 'minterms' && (
            <div className="input-section">
              <h3 className="section-title">Nhập theo minterm</h3>

              <div className="form-row">
                <div className="form-group full-width">
                  <label className="form-label">
                    {form === 'SOP' ? 'Minterms (hàm = 1):' : 'Maxterms (hàm = 0):'}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="VD: 0, 2, 3, 5, 7, 9, 11, 13, 15"
                    value={mintermInput}
                    onChange={(e) => setMintermInput(e.target.value)}
                  />
                  <small className="form-hint">Nhập các số cách nhau bởi dấu phẩy hoặc khoảng trắng</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label className="form-label">Don't care (tùy ý):</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="VD: 4, 6, 8, 10, 12, 14"
                    value={dontCareInput}
                    onChange={(e) => setDontCareInput(e.target.value)}
                  />
                  <small className="form-hint">Các ô không xác định (có thể là 0 hoặc 1)</small>
                </div>
              </div>

              <div className="button-row">
                <button className="btn-primary" onClick={handleApplyMinterms}>
                  Áp dụng
                </button>
                <button className="btn-secondary" onClick={handleClear}>
                  Xóa tất cả
                </button>
              </div>
            </div>
          )}

          {inputMode === 'expression' && (
            <div className="input-section">
              <h3 className="section-title">Nhập theo biểu thức</h3>

              <div className="form-row">
                <div className="form-group full-width">
                  <label className="form-label">Biểu thức Boolean:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="VD: A'B + BC'D hoặc AB + C"
                    value={expressionInput}
                    onChange={(e) => setExpressionInput(e.target.value)}
                  />
                  <small className="form-hint">
                    Sử dụng: ' hoặc ! cho phủ định, + cho OR, viết liền hoặc dùng &/* cho AND
                  </small>
                </div>
              </div>

              <div className="button-row">
                <button className="btn-primary" onClick={() => {
                  // Parse expression logic would go here
                  alert('Tính năng đang phát triển - sử dụng nhập theo minterm hoặc nhập trực tiếp')
                }}>
                  Áp dụng
                </button>
                <button className="btn-secondary" onClick={handleClear}>
                  Xóa
                </button>
              </div>
            </div>
          )}

          {inputMode === 'manual' && (
            <div className="input-section">
              <h3 className="section-title">Nhập trực tiếp trên bìa Karnaugh</h3>

              <div className="info-box">
                <Lightbulb className="info-icon" />
                <div className="info-text">
                  <strong>Mẹo:</strong> Nhấp vào ô trong bìa Karnaugh để chuyển đổi: 0 → 1 → d (don't care) → 0
                </div>
              </div>

              <div className="button-row">
                <button className="btn-secondary" onClick={() => handleSetAll(0)}>
                  Đặt tất cả = 0
                </button>
                <button className="btn-secondary" onClick={() => handleSetAll(1)}>
                  Đặt tất cả = 1
                </button>
                <button className="btn-secondary" onClick={() => handleSetAll('d')}>
                  Đặt tất cả = d
                </button>
                <button className="btn-danger" onClick={handleClear}>
                  Xóa tất cả
                </button>
              </div>

              <div className="kmap-container">
                <KMapGrid
                  variableCount={variableCount}
                  gridValues={gridValues}
                  groups={groups}
                  form={form}
                  hoveredGroup={hoveredGroup}
                  onCellToggle={handleCellToggle}
                  onGroupHover={setHoveredGroup}
                />
              </div>
            </div>
          )}

          <div className="navigation-buttons">
            <button
              className="btn-primary btn-large"
              onClick={() => setActiveStep('kmap')}
            >
              Tiếp theo: Xem bìa Karnaugh
              <ArrowRight className="btn-icon" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: K-Map */}
      {activeStep === 'kmap' && (
        <div className="step-content">
          <div className="kmap-detail-container">
            <div className="kmap-main">
              <h3 className="section-title">Bìa Karnaugh cho Y({variables.join(', ')})</h3>
              <KMapGrid
                variableCount={variableCount}
                gridValues={gridValues}
                groups={groups}
                form={form}
                hoveredGroup={hoveredGroup}
                onCellToggle={handleCellToggle}
                onGroupHover={setHoveredGroup}
              />
            </div>

            <div className="groups-detail">
              <h3 className="section-title">Các nhóm khoanh:</h3>
              {groups.length === 0 ? (
                <div className="empty-state">
                  <p>Chưa có nhóm nào được tạo.</p>
                </div>
              ) : (
                <div className="groups-list">
                  {groups.map((g) => (
                    <div
                      key={g.id}
                      className={`group-item ${hoveredGroup === g.id ? 'active' : ''}`}
                      onMouseEnter={() => setHoveredGroup(g.id)}
                      onMouseLeave={() => setHoveredGroup(null)}
                    >
                      <div className="group-header">
                        <span className="group-color" style={{ backgroundColor: g.color }} />
                        <span className="group-label">
                          <KaTeXView math={g.label} />
                        </span>
                      </div>
                      <div className="group-formula">
                        <KaTeXView math={`${g.label} = (${g.cells.join(', ')}) = ${g.termLatex}`} />
                      </div>
                      {g.eliminatedVariables.length > 0 && (
                        <div className="group-info">
                          <span>Loại bỏ: {g.eliminatedVariables.join(', ')}</span>
                          <span>Giữ lại: {g.keptVariables.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="navigation-buttons">
            <button
              className="btn-secondary btn-large"
              onClick={() => setActiveStep('input')}
            >
              Quay lại: Nhập dữ kiện
            </button>
            <button
              className="btn-primary btn-large"
              onClick={() => setActiveStep('result')}
            >
              Tiếp theo: Xem kết quả
              <ArrowRight className="btn-icon" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Result */}
      {activeStep === 'result' && (
        <div className="step-content">
          <div className="result-container">
            <div className="result-card">
              <div className="result-header">
                <CheckCircle2 className="result-icon" />
                <h3 className="result-title">Hàm tối thiểu</h3>
              </div>
              <div className="result-formula">
                <KaTeXView
                  math={`Y_{(${variables.join(', ')})} = ${simplifiedLatex}`}
                  block={true}
                />
              </div>
              <div className="result-plain">
                <strong>Dạng văn bản:</strong> {simplifiedPlain}
              </div>
            </div>

            <div className="result-details">
              <h4 className="subsection-title">Thông tin chi tiết:</h4>
              <ul className="detail-list">
                <li><strong>Số biến:</strong> {variableCount} ({variables.join(', ')})</li>
                <li><strong>Dạng tối thiểu:</strong> {form === 'SOP' ? 'SOP (Sum of Products)' : 'POS (Product of Sums)'}</li>
                <li><strong>Số nhóm khoanh:</strong> {groups.length}</li>
                <li><strong>Số số hạng trong hàm:</strong> {groups.length}</li>
              </ul>
            </div>

            <div className="result-note">
              <Info className="info-icon" />
              <div className="info-text">
                <strong>Lưu ý:</strong> Hàm tối thiểu này có thể được biến đổi thành mạch logic chỉ sử dụng NAND hoặc NOR.
                Số lượng cổng và độ phức tạp của mạch phụ thuộc vào biểu thức tối thiểu.
              </div>
            </div>
          </div>

          <div className="navigation-buttons">
            <button
              className="btn-secondary btn-large"
              onClick={() => setActiveStep('kmap')}
            >
              Quay lại: Bìa Karnaugh
            </button>
            <button
              className="btn-primary btn-large"
              onClick={() => setActiveStep('input')}
            >
              Giải bài mới
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
