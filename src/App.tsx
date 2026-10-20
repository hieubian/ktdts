import React, { useEffect, useMemo, useState } from 'react'
import './index.css'
import type {
  CellValue,
  CombinationalRow,
  CombinationalSubtype,
  LedPolarity,
  OptimizationForm,
  TargetGateType,
  VariableCount
} from './types'
import { getVariableNames, parseNumberList, solveKMap } from './utils/kmapSolver'
import { generateTransformations } from './utils/algebraicTransformer'
import {
  formatSubscript,
  generateBasicCircuit,
  generateMultiOutputBasicCircuit,
  generateTargetGateCircuit
} from './utils/circuitGenerator'
import { parseSevenSegmentBits, type SegmentName } from './utils/sevenSegment'

import { KMapGrid } from './components/KMapGrid'
import { CircuitViewer } from './components/CircuitViewer'
import { ProofViewer } from './components/ProofViewer'
import { TruthTableView } from './components/TruthTableView'
import { CombinationalTruthTable } from './components/CombinationalTruthTable'
import { KaTeXView } from './components/KaTeXView'
import { CheckCircle2, Info, Moon, Printer, RotateCcw, Sun, Zap } from 'lucide-react'

type ProblemType = 'cau_1' | 'cau_2'
type ViewTab = 'all' | 'kmap' | 'circuit_basic' | 'circuit_target' | 'truthtable'

export const App: React.FC = () => {
  // ── Theme ──
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('light', isLight)
  }, [isLight])

  // ── Navigation ──
  const [problemType, setProblemType] = useState<ProblemType>('cau_1')
  const [viewTab, setViewTab] = useState<ViewTab>('all')

  // ── Câu 1: Boolean Minimization ──
  const [variableCount, setVariableCount] = useState<VariableCount>(4)
  const [form, setForm] = useState<OptimizationForm>('SOP')
  const [targetGateType, setTargetGateType] = useState<TargetGateType>('nand_2')
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)

  const [gridValues, setGridValues] = useState<Record<number, CellValue>>(() => {
    const initial: Record<number, CellValue> = {}
    for (let i = 0; i < 16; i++) initial[i] = 0
    return initial
  })

  // ── Input fields ──
  const [termsText, setTermsText] = useState('')
  const [dcText, setDcText] = useState('')

  // ── Câu 2: Combinational ──
  const [combSubtype, setCombSubtype] = useState<CombinationalSubtype>('single_rule')
  const [combPolarity, setCombPolarity] = useState<LedPolarity>('cathode_common')
  const [combOutputPrefix, setCombOutputPrefix] = useState<'F' | 'G' | 'Y'>('F')
  const [sevenSegChars, setSevenSegChars] = useState('56789AEdPH')
  const [selectedSegOutputs, setSelectedSegOutputs] = useState<string[]>(['a', 'd', 'g'])

  const [singleRuleRows, setSingleRuleRows] = useState<CombinationalRow[]>(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      id: `rule-${i}`,
      decimal: i,
      inputBits: [(i >> 3) & 1, (i >> 2) & 1, (i >> 1) & 1, i & 1],
      outputBits: [0],
      isUnused: false
    }))
  })

  const [customConverterRows, setCustomConverterRows] = useState<CombinationalRow[]>(() => {
    const mapping: Record<number, number[]> = {
      0: [0, 0, 0, 0], 1: [0, 0, 0, 1], 2: [0, 1, 0, 0], 3: [0, 1, 0, 1], 4: [0, 1, 1, 1],
      5: [1, 0, 0, 0], 6: [1, 0, 0, 1], 7: [1, 1, 0, 0], 8: [1, 1, 0, 1], 9: [1, 1, 1, 1]
    }
    return Array.from({ length: 10 }, (_, dec) => ({
      id: `r-${dec}`,
      decimal: dec,
      inputBits: [(dec >> 3) & 1, (dec >> 2) & 1, (dec >> 1) & 1, dec & 1],
      outputBits: mapping[dec],
      isUnused: false
    }))
  })

  // ═══════════════════════════════
  // COMPUTED VALUES - Câu 1
  // ═══════════════════════════════
  const variables = useMemo(() => getVariableNames(variableCount), [variableCount])

  const { groups, simplifiedLatex, simplifiedPlain } = useMemo(() => {
    return solveKMap(variableCount, gridValues, form)
  }, [variableCount, gridValues, form])

  const transformationSteps = useMemo(() => {
    return generateTransformations(groups, form, targetGateType, 'Y')
  }, [groups, form, targetGateType])

  const circuitBasic = useMemo(() => {
    return generateBasicCircuit(groups, variableCount, form, 'Y')
  }, [groups, variableCount, form])

  const circuitTarget = useMemo(() => {
    return generateTargetGateCircuit(groups, variableCount, form, targetGateType, 'Y')
  }, [groups, variableCount, form, targetGateType])

  // ═══════════════════════════════
  // COMPUTED VALUES - Câu 2
  // ═══════════════════════════════
  const combInputVars = useMemo(() => ['A', 'B', 'C', 'D'], [])

  const combOutputVars = useMemo(() => {
    if (combSubtype === 'seven_segment') return selectedSegOutputs
    if (combSubtype === 'single_rule') return [combOutputPrefix === 'Y' ? 'Y' : 'F']
    const outCount = customConverterRows[0]?.outputBits?.length || 4
    if (combOutputPrefix === 'G') return outCount === 4 ? ['G_3', 'G_2', 'G_1', 'G_0'] : Array.from({ length: outCount }, (_, i) => `G_${outCount - 1 - i}`)
    if (combOutputPrefix === 'Y') return Array.from({ length: outCount }, (_, i) => `Y_${i + 1}`)
    return Array.from({ length: outCount }, (_, i) => `F_${i + 1}`)
  }, [combSubtype, selectedSegOutputs, customConverterRows, combOutputPrefix])

  const combAllRows = useMemo(() => {
    if (combSubtype === 'single_rule') return singleRuleRows
    if (combSubtype === 'seven_segment') {
      const charArr = Array.from(sevenSegChars)
      const validRows: CombinationalRow[] = charArr.map((ch, idx) => {
        const bitsMap = parseSevenSegmentBits(ch, combPolarity)
        return {
          id: `seg-row-${idx}`, decimal: idx,
          inputBits: [(idx >> 3) & 1, (idx >> 2) & 1, (idx >> 1) & 1, idx & 1],
          outputBits: selectedSegOutputs.map((s) => bitsMap[s as SegmentName] ?? 0),
          displayChar: ch, isUnused: false
        }
      })
      const unusedRows: CombinationalRow[] = Array.from({ length: 16 - charArr.length }, (_, i) => {
        const m = charArr.length + i
        return {
          id: `seg-unused-${m}`, decimal: m,
          inputBits: [(m >> 3) & 1, (m >> 2) & 1, (m >> 1) & 1, m & 1],
          outputBits: selectedSegOutputs.map(() => 'X' as const), isUnused: true
        }
      })
      return [...validRows, ...unusedRows]
    }
    const validRows = customConverterRows.filter(r => !r.isUnused)
    const presentDecimals = new Set(validRows.map(r => r.decimal))
    const unusedRows: CombinationalRow[] = Array.from({ length: 16 }, (_, i) => i)
      .filter(i => !presentDecimals.has(i))
      .map(m => ({
        id: `conv-unused-${m}`, decimal: m,
        inputBits: [(m >> 3) & 1, (m >> 2) & 1, (m >> 1) & 1, m & 1],
        outputBits: combOutputVars.map(() => 'X' as const), isUnused: true
      }))
    return [...validRows, ...unusedRows]
  }, [combSubtype, singleRuleRows, sevenSegChars, combPolarity, selectedSegOutputs, customConverterRows, combOutputVars])

  const combOutputsResults = useMemo(() => {
    return combOutputVars.map((outVarName, outIdx) => {
      const gValues: Record<number, CellValue> = {}
      for (let m = 0; m < 16; m++) {
        const row = combAllRows.find(r => r.decimal === m)
        if (row && !row.isUnused) {
          gValues[m] = row.outputBits[outIdx] === 1 ? 1 : 0
        } else {
          gValues[m] = 'd'
        }
      }
      const { groups: gList, simplifiedLatex: sLatex, simplifiedPlain: sPlain } = solveKMap(4, gValues, 'SOP')
      return {
        name: outVarName,
        groups: gList.map((g, gIdx) => ({ ...g, id: `${outVarName}-grp-${gIdx}` })),
        simplifiedLatex: sLatex, simplifiedPlain: sPlain, gridValues: gValues
      }
    })
  }, [combOutputVars, combAllRows])

  const combCircuit = useMemo(() => {
    return generateMultiOutputBasicCircuit(combOutputsResults, 4, 'SOP')
  }, [combOutputsResults])

  // ═══════════════════════════════
  // HANDLERS
  // ═══════════════════════════════
  const handleVariableCountChange = (newCount: VariableCount) => {
    setVariableCount(newCount)
    const total = 1 << newCount
    setGridValues(prev => {
      const next: Record<number, CellValue> = {}
      for (let i = 0; i < total; i++) next[i] = prev[i] ?? 0
      return next
    })
  }

  const handleCellToggle = (minterm: number) => {
    setGridValues(prev => {
      const current = prev[minterm] ?? 0
      let next: CellValue = 0
      if (current === 0) next = 1
      else if (current === 1) next = 'd'
      else next = 0
      return { ...prev, [minterm]: next }
    })
  }

  const applyMintermsFromText = (newTerms: string, newDc: string) => {
    setTermsText(newTerms)
    setDcText(newDc)
    const total = 1 << variableCount
    const parsedTerms = parseNumberList(newTerms)
    const parsedDc = parseNumberList(newDc)
    const defaultVal: CellValue = form === 'SOP' ? 0 : 1
    const targetVal: CellValue = form === 'SOP' ? 1 : 0
    const next: Record<number, CellValue> = {}
    for (let i = 0; i < total; i++) next[i] = defaultVal
    for (const t of parsedTerms) { if (t < total) next[t] = targetVal }
    for (const d of parsedDc) { if (d < total) next[d] = 'd' }
    setGridValues(next)
  }

  const handleClear = () => {
    const total = 1 << variableCount
    const next: Record<number, CellValue> = {}
    for (let i = 0; i < total; i++) next[i] = 0
    setGridValues(next)
    setTermsText('')
    setDcText('')
  }

  const handleCombToggleOutputBit = (rowId: string, outIdx: number) => {
    if (combSubtype === 'single_rule') {
      setSingleRuleRows(prev => prev.map(r => {
        if (r.id !== rowId) return r
        const newBits = [...r.outputBits]
        newBits[outIdx] = r.outputBits[outIdx] === 1 ? 0 : 1
        return { ...r, outputBits: newBits }
      }))
    } else if (combSubtype === 'code_converter') {
      setCustomConverterRows(prev => prev.map(r => {
        if (r.id !== rowId) return r
        const newBits = [...r.outputBits]
        newBits[outIdx] = r.outputBits[outIdx] === 1 ? 0 : 1
        return { ...r, outputBits: newBits }
      }))
    }
  }

  // Sync termsText/dcText from grid
  useEffect(() => {
    const total = 1 << variableCount
    const targetVal: CellValue = form === 'SOP' ? 1 : 0
    const terms: number[] = []
    const dcs: number[] = []
    for (let i = 0; i < total; i++) {
      if (gridValues[i] === targetVal) terms.push(i)
      else if (gridValues[i] === 'd') dcs.push(i)
    }
    setTermsText(terms.join(', '))
    setDcText(dcs.join(', '))
  }, [gridValues, form, variableCount])

  const gateLabelMap: Record<TargetGateType, string> = {
    basic: 'cổng LOGIC cơ bản (AND, OR, NOT)',
    nand_2: 'cổng NAND 2 đầu vào',
    nand_n: 'cổng NAND N đầu vào',
    nor_2: 'cổng NOR 2 đầu vào',
    nor_n: 'cổng NOR N đầu vào'
  }

  // ═══════════════════════════════
  // RENDER
  // ═══════════════════════════════
  return (
    <div className="app-root">
      {/* ── TOP NAVIGATION ── */}
      <header className="top-nav no-print">
        <div className="top-nav-inner">
          <div className="nav-brand">
            <div className="nav-brand-icon">KR</div>
            <span className="nav-brand-text">KarnaughResolve</span>
          </div>
          <div className="nav-actions">
            <button className="nav-icon-btn" onClick={() => window.print()} title="In / Lưu PDF">
              <Printer size={16} />
            </button>
            <button className="nav-icon-btn" onClick={() => setIsLight(l => !l)} title="Đổi giao diện">
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
      </header>

      <main className="main-wrapper">
        {/* ── PROBLEM TYPE SELECTOR ── */}
        <div className="problem-selector no-print">
          <div
            className={`problem-card ${problemType === 'cau_1' ? 'active' : ''}`}
            onClick={() => { setProblemType('cau_1'); setViewTab('all') }}
          >
            <div className="problem-card-content">
              <div className="problem-card-number">1</div>
              <div className="problem-card-title">Rút gọn hàm Boolean</div>
              <div className="problem-card-desc">
                Nhập minterms/maxterms → Bìa Karnaugh → Biểu thức tối thiểu → Biến đổi đại số → Sơ đồ mạch
              </div>
            </div>
          </div>
          <div
            className={`problem-card ${problemType === 'cau_2' ? 'active' : ''}`}
            onClick={() => { setProblemType('cau_2'); setViewTab('all') }}
          >
            <div className="problem-card-content">
              <div className="problem-card-number">2</div>
              <div className="problem-card-title">Thiết kế mạch Logic tổ hợp</div>
              <div className="problem-card-desc">
                Bảng trạng thái → Bìa K cho từng đầu ra → Phương trình → Sơ đồ mạch tổ hợp
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            CÂU 1: RÚT GỌN HÀM BOOLEAN
            ═══════════════════════════════════════ */}
        {problemType === 'cau_1' && (
          <>
            {/* ── INPUT SECTION ── */}
            <div className="glass-card no-print animate-fadein">
              <div className="glass-card-header">
                <Zap className="card-icon" />
                <h3>Nhập dữ liệu đề bài</h3>
              </div>
              <div className="glass-card-body">
                <div className="input-section">
                  {/* Row 1: Variable Count + Form */}
                  <div className="input-row">
                    <div className="input-group">
                      <label className="input-label">Số biến</label>
                      <div className="seg-control">
                        {([2, 3, 4] as VariableCount[]).map(v => (
                          <button key={v} className={`seg-btn ${variableCount === v ? 'active' : ''}`}
                            onClick={() => handleVariableCountChange(v)}>
                            {v} biến
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Dạng chuẩn tắc</label>
                      <div className="seg-control">
                        <button className={`seg-btn ${form === 'SOP' ? 'active' : ''}`}
                          onClick={() => setForm('SOP')}>SOP (∑ Tuyển)</button>
                        <button className={`seg-btn ${form === 'POS' ? 'active' : ''}`}
                          onClick={() => setForm('POS')}>POS (∏ Hội)</button>
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Cổng thực hiện (Câu c)</label>
                      <select className="select-field" value={targetGateType}
                        onChange={e => setTargetGateType(e.target.value as TargetGateType)}>
                        <option value="nand_2">NAND 2 đầu vào</option>
                        <option value="nor_2">NOR 2 đầu vào</option>
                        <option value="nand_n">NAND N đầu vào</option>
                        <option value="nor_n">NOR N đầu vào</option>
                        <option value="basic">Cổng cơ bản (AND, OR, NOT)</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Minterms / Maxterms + Don't cares */}
                  <div className="input-row">
                    <div className="input-group">
                      <label className="input-label">
                        {form === 'SOP' ? 'Chỉ số Minterm (ô = 1)' : 'Chỉ số Maxterm (ô = 0)'}
                      </label>
                      <input type="text" className="text-field"
                        placeholder="VD: 1, 5, 6, 7, 8, 12"
                        value={termsText}
                        onChange={e => applyMintermsFromText(e.target.value, dcText)} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Don't care (ô = X)</label>
                      <input type="text" className="text-field"
                        placeholder="VD: 4, 10, 14"
                        value={dcText}
                        onChange={e => applyMintermsFromText(termsText, e.target.value)} />
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="quick-actions">
                    <button className="action-btn" onClick={handleClear}>
                      <RotateCcw /> Xóa sạch
                    </button>
                    <button className="action-btn" onClick={() => {
                      const total = 1 << variableCount
                      const next: Record<number, CellValue> = {}
                      for (let i = 0; i < total; i++) next[i] = 1
                      setGridValues(next)
                    }}>
                      Gán tất cả = 1
                    </button>
                    <span className="hint-text">💡 Click trực tiếp vào ô trên bìa K để đổi: 0 → 1 → X → 0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── VIEW TABS ── */}
            <div className="tab-bar no-print">
              <button className={`tab-btn ${viewTab === 'all' ? 'active' : ''}`} onClick={() => setViewTab('all')}>
                📋 Bài giải đầy đủ
              </button>
              <button className={`tab-btn ${viewTab === 'kmap' ? 'active' : ''}`} onClick={() => setViewTab('kmap')}>
                🗺️ Bìa Karnaugh
              </button>
              <button className={`tab-btn ${viewTab === 'circuit_basic' ? 'active' : ''}`} onClick={() => setViewTab('circuit_basic')}>
                ⚡ Mạch cơ bản
              </button>
              <button className={`tab-btn ${viewTab === 'circuit_target' ? 'active' : ''}`} onClick={() => setViewTab('circuit_target')}>
                🔧 Biến đổi & Mạch
              </button>
              <button className={`tab-btn ${viewTab === 'truthtable' ? 'active' : ''}`} onClick={() => setViewTab('truthtable')}>
                📊 Bảng chân lý
              </button>
            </div>

            {/* ═══ CÂU A: BÌA KARNAUGH ═══ */}
            {(viewTab === 'all' || viewTab === 'kmap') && (
              <div className="section-card animate-fadein">
                <div className="section-header">
                  <span className="section-part-label">Câu a</span>
                  <h3>Rút gọn hàm Y({variables.join(', ')}) bằng bìa Karnaugh</h3>
                </div>
                <div className="section-body">
                  <div className="kmap-groups-layout">
                    {/* K-Map */}
                    <div>
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

                    {/* Groups detail */}
                    <div>
                      <div className="summary-badge">
                        <CheckCircle2 />
                        <span>
                          {groups.length} vòng khoanh tối ưu
                          {groups.length > 0 && ` (${[
                            groups.filter(g => g.cells.length === 8).length > 0 && `${groups.filter(g => g.cells.length === 8).length}×8ô`,
                            groups.filter(g => g.cells.length === 4).length > 0 && `${groups.filter(g => g.cells.length === 4).length}×4ô`,
                            groups.filter(g => g.cells.length === 2).length > 0 && `${groups.filter(g => g.cells.length === 2).length}×2ô`,
                            groups.filter(g => g.cells.length === 1).length > 0 && `${groups.filter(g => g.cells.length === 1).length}×1ô`,
                          ].filter(Boolean).join(', ')})`}
                        </span>
                      </div>

                      <div className="groups-list">
                        {groups.map((g) => (
                          <div key={g.id}
                            className={`group-item ${hoveredGroup === g.id ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredGroup(g.id)}
                            onMouseLeave={() => setHoveredGroup(null)}>
                            <div className="group-dot" style={{ backgroundColor: g.color }} />
                            <div className="group-info">
                              <div className="group-formula">
                                <KaTeXView math={`${g.label}(${g.cells.join(',\\,')}) = ${g.termLatex}`} />
                                <span className="group-size-tag">Vòng {g.cells.length} ô</span>
                              </div>
                              {g.eliminatedVariables.length > 0 && (
                                <div className="group-note">
                                  Loại bỏ: {g.eliminatedVariables.join(', ')} → Giữ: {g.keptVariables.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Result */}
                      <div className="result-box">
                        <div className="result-label">
                          <CheckCircle2 />
                          <span>Hàm tối thiểu</span>
                        </div>
                        <div className="result-math">
                          <KaTeXView math={`Y_{(${variables.join(', ')})} = ${simplifiedLatex}`} block={true} />
                        </div>
                      </div>

                      <div className="info-box">
                        <Info />
                        <p><strong>Quy tắc:</strong> Mỗi vòng phải có kích thước lũy thừa 2 (1, 2, 4, 8, 16). Tất cả ô mục tiêu phải được phủ. Không có vòng thừa.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ CÂU B: SƠ ĐỒ MẠCH CƠ BẢN ═══ */}
            {(viewTab === 'all' || viewTab === 'circuit_basic') && (
              <div className="section-card animate-fadein">
                <div className="section-header">
                  <span className="section-part-label">Câu b</span>
                  <h3>Vẽ sơ đồ mạch sử dụng cổng LOGIC cơ bản (AND, OR, NOT)</h3>
                </div>
                <div className="section-body">
                  <CircuitViewer
                    diagram={circuitBasic}
                    title="Sơ đồ mạch sử dụng cổng LOGIC cơ bản"
                    subtitle={`Biểu thức thực hiện: Y = ${simplifiedPlain}`}
                  />
                </div>
              </div>
            )}

            {/* ═══ CÂU C: BIẾN ĐỔI ĐẠI SỐ + MẠCH ═══ */}
            {(viewTab === 'all' || viewTab === 'circuit_target') && (
              <div className="section-card animate-fadein">
                <div className="section-header">
                  <span className="section-part-label">Câu c</span>
                  <h3>Xây dựng mạch chỉ sử dụng {gateLabelMap[targetGateType]}</h3>
                </div>
                <div className="section-body">
                  <h4 style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-heading)', marginBottom: 'var(--space-md)' }}>
                    1. Biến đổi đại số Boole (Hoàn nguyên & De Morgan):
                  </h4>
                  <ProofViewer steps={transformationSteps} funcName="Y" />

                  <h4 style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-heading)', margin: 'var(--space-xl) 0 var(--space-md)' }}>
                    2. Sơ đồ mạch tương ứng:
                  </h4>
                  <CircuitViewer
                    diagram={circuitTarget}
                    title={`Sơ đồ mạch chỉ sử dụng ${gateLabelMap[targetGateType]}`}
                  />
                </div>
              </div>
            )}

            {/* ═══ BẢNG CHÂN LÝ ═══ */}
            {(viewTab === 'all' || viewTab === 'truthtable') && (
              <div className="section-card animate-fadein">
                <div className="section-header">
                  <span className="section-part-label">Phụ lục</span>
                  <h3>Bảng chân lý</h3>
                </div>
                <div className="section-body">
                  <TruthTableView
                    variableCount={variableCount}
                    gridValues={gridValues}
                    form={form}
                    onCellToggle={handleCellToggle}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════
            CÂU 2: THIẾT KẾ MẠCH TỔ HỢP
            ═══════════════════════════════════════ */}
        {problemType === 'cau_2' && (
          <>
            {/* ── INPUT ── */}
            <div className="glass-card no-print animate-fadein">
              <div className="glass-card-header">
                <Zap className="card-icon" />
                <h3>Cấu hình mạch tổ hợp</h3>
              </div>
              <div className="glass-card-body">
                <div className="comb-config">
                  <div className="input-group">
                    <label className="input-label">Dạng bài</label>
                    <div className="seg-control">
                      <button className={`seg-btn ${combSubtype === 'single_rule' ? 'active' : ''}`}
                        onClick={() => setCombSubtype('single_rule')}>Quy tắc đơn</button>
                      <button className={`seg-btn ${combSubtype === 'code_converter' ? 'active' : ''}`}
                        onClick={() => setCombSubtype('code_converter')}>Chuyển mã</button>
                      <button className={`seg-btn ${combSubtype === 'seven_segment' ? 'active' : ''}`}
                        onClick={() => setCombSubtype('seven_segment')}>7-Segment</button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Ký hiệu ngõ ra</label>
                    <div className="seg-control">
                      {(['F', 'G', 'Y'] as const).map(p => (
                        <button key={p} className={`seg-btn ${combOutputPrefix === p ? 'active' : ''}`}
                          onClick={() => setCombOutputPrefix(p)}>{p}</button>
                      ))}
                    </div>
                  </div>
                  {combSubtype === 'seven_segment' && (
                    <>
                      <div className="input-group">
                        <label className="input-label">Phân cực LED</label>
                        <div className="seg-control">
                          <button className={`seg-btn ${combPolarity === 'cathode_common' ? 'active' : ''}`}
                            onClick={() => setCombPolarity('cathode_common')}>Cathode chung</button>
                          <button className={`seg-btn ${combPolarity === 'anode_common' ? 'active' : ''}`}
                            onClick={() => setCombPolarity('anode_common')}>Anode chung</button>
                        </div>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Chuỗi ký tự hiển thị</label>
                        <input type="text" className="text-field" value={sevenSegChars}
                          onChange={e => setSevenSegChars(e.target.value)} placeholder="VD: 56789AEdPH" />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Chọn segment đầu ra</label>
                        <div className="seg-control" style={{ flexWrap: 'wrap' }}>
                          {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map(s => (
                            <button key={s}
                              className={`seg-btn ${selectedSegOutputs.includes(s) ? 'active' : ''}`}
                              onClick={() => {
                                setSelectedSegOutputs(prev =>
                                  prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
                              }}>{s}</button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Editable truth table */}
                <div className="comb-truth-table">
                  <CombinationalTruthTable
                    inputVars={combInputVars}
                    outputVars={combOutputVars}
                    rows={combAllRows}
                    isSevenSegment={combSubtype === 'seven_segment'}
                    polarity={combPolarity}
                    onToggleOutputBit={handleCombToggleOutputBit}
                  />
                </div>
              </div>
            </div>

            {/* ── VIEW TABS ── */}
            <div className="tab-bar no-print">
              <button className={`tab-btn ${viewTab === 'all' ? 'active' : ''}`} onClick={() => setViewTab('all')}>
                📋 Bài giải đầy đủ
              </button>
              <button className={`tab-btn ${viewTab === 'kmap' ? 'active' : ''}`} onClick={() => setViewTab('kmap')}>
                🗺️ Bìa Karnaugh
              </button>
              <button className={`tab-btn ${viewTab === 'circuit_basic' ? 'active' : ''}`} onClick={() => setViewTab('circuit_basic')}>
                ⚡ Sơ đồ mạch
              </button>
            </div>

            {/* ═══ BƯỚC 1: BẢNG TRẠNG THÁI ═══ */}
            {(viewTab === 'all') && (
              <div className="section-card animate-fadein">
                <div className="section-header">
                  <span className="section-part-label">Bước 1</span>
                  <h3>Bảng trạng thái (Bảng chân lý)</h3>
                </div>
                <div className="section-body">
                  <CombinationalTruthTable
                    inputVars={combInputVars}
                    outputVars={combOutputVars}
                    rows={combAllRows}
                    isSevenSegment={combSubtype === 'seven_segment'}
                    polarity={combPolarity}
                    onToggleOutputBit={handleCombToggleOutputBit}
                  />
                </div>
              </div>
            )}

            {/* ═══ BƯỚC 2: BÌA KARNAUGH CHO TỪNG ĐẦU RA ═══ */}
            {(viewTab === 'all' || viewTab === 'kmap') && (
              <div className="section-card animate-fadein">
                <div className="section-header">
                  <span className="section-part-label">Bước 2</span>
                  <h3>Bìa Karnaugh rút gọn cho {combOutputVars.length === 1 ? 'hàm đầu ra' : 'từng đầu ra'}</h3>
                </div>
                <div className="section-body">
                  <div className="multi-kmap-grid">
                    {combOutputsResults.map(res => (
                      <div key={res.name} className="single-kmap-card">
                        <div className="single-kmap-header">
                          <span className="output-badge"><KaTeXView math={res.name} /></span>
                          <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
                            Bìa K cho <KaTeXView math={`${res.name}(${combInputVars.join(', ')})`} />
                          </h4>
                        </div>
                        <div className="single-kmap-body">
                          <KMapGrid
                            variableCount={4}
                            gridValues={res.gridValues}
                            groups={res.groups}
                            form="SOP"
                            hoveredGroup={hoveredGroup}
                            onCellToggle={() => { }}
                            onGroupHover={setHoveredGroup}
                          />

                          {/* Groups */}
                          <div className="groups-list" style={{ marginTop: 'var(--space-md)' }}>
                            {res.groups.length === 0 ? (
                              <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', fontStyle: 'italic' }}>
                                Hàm đồng nhất = 0
                              </div>
                            ) : (
                              res.groups.map(g => (
                                <div key={g.id}
                                  className={`group-item ${hoveredGroup === g.id ? 'hovered' : ''}`}
                                  onMouseEnter={() => setHoveredGroup(g.id)}
                                  onMouseLeave={() => setHoveredGroup(null)}
                                  style={{ padding: '8px 12px' }}>
                                  <div className="group-dot" style={{ backgroundColor: g.color, width: 8, height: 8 }} />
                                  <div className="group-info">
                                    <div className="group-formula" style={{ fontSize: '12px' }}>
                                      <KaTeXView math={`${g.label}(${g.cells.join(',')}) = ${g.termLatex}`} />
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="result-box" style={{ marginTop: 'var(--space-sm)' }}>
                            <div className="result-label">
                              <CheckCircle2 />
                              <span>Phương trình tối thiểu</span>
                            </div>
                            <div className="result-math">
                              <KaTeXView math={`${res.name} = ${res.simplifiedLatex}`} block={true} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ BƯỚC 3: SƠ ĐỒ MẠCH TỔ HỢP ═══ */}
            {(viewTab === 'all' || viewTab === 'circuit_basic') && (
              <div className="section-card animate-fadein">
                <div className="section-header">
                  <span className="section-part-label">Bước 3</span>
                  <h3>Sơ đồ mạch tổ hợp</h3>
                </div>
                <div className="section-body">
                  <CircuitViewer
                    diagram={combCircuit}
                    title={`Sơ đồ mạch tổ hợp cho ${combOutputVars.map(formatSubscript).join(', ')}`}
                    subtitle={`Thực hiện các phương trình tối ưu từ bus ${combInputVars.join(', ')}`}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App
