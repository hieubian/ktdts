import React from 'react'
import type { CellValue, OptimizationForm, VariableCount } from '../types'
import { getVariableNames } from '../utils/kmapSolver'
import { KaTeXView } from './KaTeXView'

interface TruthTableViewProps {
  variableCount: VariableCount
  gridValues: Record<number, CellValue>
  form: OptimizationForm
  onCellToggle: (minterm: number) => void
}

export const TruthTableView: React.FC<TruthTableViewProps> = ({
  variableCount,
  gridValues,
  form,
  onCellToggle
}) => {
  const variables = getVariableNames(variableCount)
  const totalRows = 1 << variableCount

  const getAlgebraicTerm = (m: number) => {
    if (form === 'SOP') {
      const lits = variables.map((v, bitIdx) => {
        const bit = (m >> (variableCount - 1 - bitIdx)) & 1
        return bit === 1 ? v : `\\overline{${v}}`
      })
      return `m_{${m}} = ${lits.join('\\cdot ')}`
    } else {
      const lits = variables.map((v, bitIdx) => {
        const bit = (m >> (variableCount - 1 - bitIdx)) & 1
        return bit === 0 ? v : `\\overline{${v}}`
      })
      return `M_{${m}} = (${lits.join(' + ')})`
    }
  }

  return (
    <div className="truth-table-wrapper">
      <p className="hint-text" style={{ marginBottom: 'var(--space-sm)' }}>
        💡 Click vào ô Y để chỉnh sửa giá trị (0 → 1 → X → 0)
      </p>
      <table className="truth-table">
        <thead>
          <tr>
            <th>#</th>
            {variables.map(v => <th key={v} className="col-input">{v}</th>)}
            <th>{form === 'SOP' ? 'Minterm' : 'Maxterm'}</th>
            <th className="col-output">Y</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: totalRows }, (_, m) => {
            const val = gridValues[m] ?? 0
            const valClass = val === 1 ? 'val-1' : val === 'd' ? 'val-x' : 'val-0'

            return (
              <tr key={m}>
                <td style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>{m}</td>
                {Array.from({ length: variableCount }, (_, bitIdx) => {
                  const bit = (m >> (variableCount - 1 - bitIdx)) & 1
                  return <td key={bitIdx} className="col-input">{bit}</td>
                })}
                <td style={{ fontSize: '12px' }}>
                  <KaTeXView math={getAlgebraicTerm(m)} />
                </td>
                <td className={`col-output ${valClass}`}
                  onClick={() => onCellToggle(m)}
                  style={{ cursor: 'pointer', fontWeight: 700 }}>
                  {val === 'd' ? 'X' : val}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
