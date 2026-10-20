import React, { useState, useMemo } from 'react'
import { Info, Lightbulb } from 'lucide-react'
import '../pages/ProblemType1.css'
import { COMMON_PRESETS, parseSevenSegmentBits } from '../utils/sevenSegment'
import { solveKMap } from '../utils/kmapSolver'
import { KMapGrid } from '../components/KMapGrid'
import { KaTeXView } from '../components/KaTeXView'
import type { CellValue, LedPolarity, SegmentName } from '../types'

export const ProblemType4: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [customChars, setCustomChars] = useState('56789AEdPH')
  const [selectedSegments, setSelectedSegments] = useState<SegmentName[]>(['a', 'd', 'g'])
  const [polarity, setPolarity] = useState<LedPolarity>('cathode_common')
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)

  const currentPreset = COMMON_PRESETS[selectedPreset]

  const outputsResults = useMemo(() => {
    const chars = customChars || currentPreset.chars
    const segments = selectedSegments.length > 0 ? selectedSegments : currentPreset.segments
    const currentPolarity = polarity || currentPreset.polarity

    return segments.map((segName) => {
      const gValues: Record<number, CellValue> = {}

      // Fill valid rows
      Array.from(chars).forEach((ch, idx) => {
        const dec = idx
        if (dec < 16) {
          const bitsMap = parseSevenSegmentBits(ch, currentPolarity)
          gValues[dec] = bitsMap[segName] as CellValue
        }
      })

      // Fill unused rows as don't care
      for (let m = chars.length; m < 16; m++) {
        gValues[m] = 'd'
      }

      const { groups, simplifiedLatex, simplifiedPlain } = solveKMap(4, gValues, 'SOP')

      return {
        name: segName,
        groups: groups.map((g, gIdx) => ({ ...g, id: `${segName}-grp-${gIdx}` })),
        simplifiedLatex,
        simplifiedPlain,
        gridValues: gValues
      }
    })
  }, [customChars, selectedSegments, polarity, currentPreset])

  const handlePresetChange = (index: number) => {
    setSelectedPreset(index)
    const preset = COMMON_PRESETS[index]
    setCustomChars(preset.chars)
    setSelectedSegments(preset.segments)
    setPolarity(preset.polarity)
  }

  const toggleSegment = (seg: SegmentName) => {
    setSelectedSegments((prev) => {
      if (prev.includes(seg)) {
        return prev.filter((s) => s !== seg)
      } else {
        return [...prev, seg].sort()
      }
    })
  }

  return (
    <div className="problem-type-1">
      <div className="problem-header">
        <h1 className="problem-title">
          <span className="problem-badge">Dạng 4</span>
          Thiết kế mạch điều khiển LED 7 đoạn
        </h1>
        <p className="problem-description">
          Áp dụng cho <strong>Câu 8, 9</strong>. Thiết kế mạch decoder BCD sang LED 7 đoạn (Catốt/Anốt chung).
        </p>
      </div>

      <div className="step-content">
        <div className="info-box">
          <Info className="info-icon" />
          <div className="info-text">
            <strong>Hướng dẫn:</strong> Chọn preset hoặc tùy chỉnh các ký tự hiển thị, thanh LED cần thiết kế, và loại LED (Catốt/Anốt chung).
          </div>
        </div>

        <div className="input-section">
          <h3 className="section-title">Preset bài tập phổ biến</h3>

          <div className="form-row">
            <div className="form-group full-width">
              <label className="form-label">Chọn preset:</label>
              <select
                className="form-select"
                value={selectedPreset}
                onChange={(e) => handlePresetChange(Number(e.target.value))}
              >
                {COMMON_PRESETS.map((preset, idx) => (
                  <option key={idx} value={idx}>{preset.label}</option>
                ))}
              </select>
              <small className="form-hint">{currentPreset.description}</small>
            </div>
          </div>
        </div>

        <div className="input-section">
          <h3 className="section-title">Tùy chỉnh</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Các ký tự hiển thị:</label>
              <input
                type="text"
                className="form-input"
                placeholder="VD: 56789AEdPH"
                value={customChars}
                onChange={(e) => setCustomChars(e.target.value)}
              />
              <small className="form-hint">Từ 1-10 ký tự (0-9, A-F, P, H, E, d)</small>
            </div>

            <div className="form-group">
              <label className="form-label">Loại LED:</label>
              <select
                className="form-select"
                value={polarity}
                onChange={(e) => setPolarity(e.target.value as LedPolarity)}
              >
                <option value="cathode_common">Catốt chung (1 = sáng)</option>
                <option value="anode_common">Anốt chung (0 = sáng)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label className="form-label">Chọn thanh LED cần thiết kế:</label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {(['a', 'b', 'c', 'd', 'e', 'f', 'g'] as SegmentName[]).map((seg) => (
                  <button
                    key={seg}
                    type="button"
                    onClick={() => toggleSegment(seg)}
                    style={{
                      padding: '0.625rem 1.25rem',
                      border: selectedSegments.includes(seg) ? '2px solid #667eea' : '1px solid var(--color-border)',
                      borderRadius: '8px',
                      background: selectedSegments.includes(seg) ? '#667eea' : 'var(--color-bg-secondary)',
                      color: selectedSegments.includes(seg) ? 'white' : 'var(--color-text)',
                      cursor: 'pointer',
                      fontWeight: selectedSegments.includes(seg) ? 600 : 400,
                      transition: 'all 0.2s'
                    }}
                  >
                    Thanh {seg.toUpperCase()}
                  </button>
                ))}
              </div>
              <small className="form-hint">Chọn một hoặc nhiều thanh cần thiết kế mạch</small>
            </div>
          </div>
        </div>

        {selectedSegments.length > 0 && (
          <div className="input-section">
            <h3 className="section-title">Bìa Karnaugh cho từng thanh LED</h3>

            <div className="info-box">
              <Lightbulb className="info-icon" />
              <div className="info-text">
                <strong>Mẹo:</strong> Mỗi thanh LED là một hàm đầu ra riêng. Bạn cần rút gọn từng hàm và vẽ mạch tổng hợp.
              </div>
            </div>

            {outputsResults.map((result) => (
              <div key={result.name} style={{ marginBottom: '2rem' }}>
                <h4 className="subsection-title">
                  Thanh {result.name.toUpperCase()} - Hàm <KaTeXView math={result.name} />
                </h4>

                <KMapGrid
                  variableCount={4}
                  gridValues={result.gridValues}
                  groups={result.groups}
                  form="SOP"
                  hoveredGroup={hoveredGroup}
                  onGroupHover={setHoveredGroup}
                />

                <div className="result-card" style={{ marginTop: '1rem' }}>
                  <div className="result-formula">
                    <KaTeXView
                      math={`${result.name}_{(A, B, C, D)} = ${result.simplifiedLatex}`}
                      block={true}
                    />
                  </div>
                  <div className="result-plain">
                    <strong>Dạng văn bản:</strong> {result.name} = {result.simplifiedPlain}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="result-note">
          <Info className="info-icon" />
          <div className="info-text">
            <strong>Lưu ý:</strong> Sau khi rút gọn từng thanh, bạn cần vẽ sơ đồ mạch tổng hợp với các đầu vào
            A, B, C, D và đầu ra a, b, c, d, e, f, g tương ứng.
          </div>
        </div>
      </div>
    </div>
  )
}
