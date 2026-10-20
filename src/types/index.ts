// Các dạng bài tập chính
export type ProblemType =
  | 'dang_1' // Câu 1-3: Rút gọn hàm Boolean, vẽ mạch cơ bản và chuyển đổi
  | 'dang_2' // Câu 4-5: Thiết kế mạch theo quy tắc logic
  | 'dang_3' // Câu 6-7: Mạch chuyển mã (Code converter)
  | 'dang_4' // Câu 8-9: Mạch hiển thị LED 7 đoạn

export type VariableCount = 2 | 3 | 4
export type CellValue = 0 | 1 | 'd' | 'X'
export type OptimizationForm = 'SOP' | 'POS'
export type TargetGateType = 'basic' | 'nand_2' | 'nand_n' | 'nor_2' | 'nor_n'
export type LedPolarity = 'cathode_common' | 'anode_common'

export interface Literal {
  variable: string
  inverted: boolean
}

export interface KMapGroup {
  id: string
  label: string
  cells: number[]
  rowIndices: number[]
  colIndices: number[]
  literals: Literal[]
  eliminatedVariables: string[]
  keptVariables: string[]
  termLatex: string
  rawTerm: string
  color: string
}

export interface TransformationStep {
  title: string
  description: string
  ruleName?: string
  ruleFormula?: string
  latex: string
}

export interface CircuitNode {
  id: string
  type: 'input' | 'not' | 'and' | 'or' | 'nand' | 'nor' | 'output'
  label?: string
  x: number
  y: number
  inputs: string[]
  invertedInputs?: boolean[]
  tiedInput?: boolean
}

export interface WireConnection {
  fromNodeId: string
  toNodeId: string
  fromPin?: number
  toPin?: number
  busLine?: string
  isDirectBusTap?: boolean
  points: { x: number; y: number }[]
  color?: string
}

export interface CircuitDiagram {
  width: number
  height: number
  railXMap: Record<string, number>
  nodes: CircuitNode[]
  wires: WireConnection[]
  taps: { x: number; y: number }[]
}

// Dạng 2: Bảng trạng thái cho mạch theo quy tắc
export interface TruthTableRow {
  id: string
  decimal: number
  inputBits: number[]
  outputBits: (number | 'X')[]
  isUnused?: boolean
  displayChar?: string
}

// Dạng 3: Chuyển mã
export interface CodeConverterConfig {
  inputName: string  // BCD, Gray, Excess-3, etc.
  outputName: string
  inputBits: number
  outputBits: number
  mappings: Record<number, number[]>
}

// Dạng 4: LED 7 đoạn
export type SegmentName = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'

export interface SevenSegmentConfig {
  chars: string[]
  segments: SegmentName[]
  polarity: LedPolarity
}

export interface OutputResult {
  name: string
  groups: KMapGroup[]
  simplifiedLatex: string
  simplifiedPlain: string
  gridValues: Record<number, CellValue>
}
