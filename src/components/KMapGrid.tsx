import React from 'react'
import type { CellValue, KMapGroup, OptimizationForm, VariableCount } from '../types'
import { cellToMinterm, formatGray, getColGrayCodes, getGridDimensions, getRowGrayCodes } from '../utils/kmapSolver'

interface KMapGridProps {
  variableCount: VariableCount
  gridValues: Record<number, CellValue>
  groups: KMapGroup[]
  form: OptimizationForm
  hoveredGroup: string | null
  onCellToggle: (minterm: number) => void
  onGroupHover: (groupId: string | null) => void
}

export const KMapGrid: React.FC<KMapGridProps> = ({
  variableCount,
  gridValues,
  groups,
  form,
  hoveredGroup,
  onCellToggle,
  onGroupHover
}) => {
  const { rowVars, colVars } = getGridDimensions(variableCount)
  const rowGrays = getRowGrayCodes(variableCount)
  const colGrays = getColGrayCodes(variableCount)
  const rowBits = variableCount === 4 ? 2 : 1
  const colBits = variableCount === 2 ? 1 : 2

  const cellGroupMap: Record<number, KMapGroup[]> = {}
  groups.forEach(g => {
    g.cells.forEach(c => {
      if (!cellGroupMap[c]) cellGroupMap[c] = []
      cellGroupMap[c].push(g)
    })
  })

  return (
    <div className="kmap-wrapper">
      <table className="kmap-table">
        <thead>
          <tr>
            <th className="kmap-corner">
              <span className="diag-top">{colVars.join('')}</span>
              <span className="diag-line" />
              <span className="diag-bot">{rowVars.join('')}</span>
            </th>
            {colGrays.map((val, colIdx) => (
              <th key={colIdx}>{formatGray(val, colBits)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowGrays.map((rVal, rowIdx) => (
            <tr key={rowIdx}>
              <th>{formatGray(rVal, rowBits)}</th>
              {colGrays.map((_, colIdx) => {
                const m = cellToMinterm(variableCount, rowIdx, colIdx)
                const cellVal = gridValues[m] ?? 0
                const coveringGroups = cellGroupMap[m] || []
                const isHovered = hoveredGroup && coveringGroups.some(g => g.id === hoveredGroup)
                const primaryGroup = coveringGroups[0]

                const valClass = cellVal === 1 ? 'val-1' : cellVal === 'd' ? 'val-d' : 'val-0'

                const style: React.CSSProperties = {}
                if (coveringGroups.length > 0) {
                  style.borderColor = isHovered ? '#d97706' : primaryGroup.color
                  style.backgroundColor = isHovered
                    ? 'rgba(217, 119, 6, 0.1)'
                    : `${primaryGroup.color}10`
                  if (isHovered) style.borderWidth = '3px'
                }

                return (
                  <td key={colIdx}
                    className={`kmap-cell ${valClass} ${isHovered ? 'cell-hovered' : ''}`}
                    style={style}
                    onClick={() => onCellToggle(m)}
                    title={`Minterm ${m}: Click để đổi 0→1→X→0`}
                  >
                    <span className="cell-idx">{m}</span>
                    <span className="cell-val">{cellVal === 'd' ? 'X' : cellVal}</span>
                    {coveringGroups.length > 0 && (
                      <div className="cell-tags">
                        {coveringGroups.map(g => (
                          <span key={g.id} className="cell-tag"
                            style={{ backgroundColor: g.color }}
                            onMouseEnter={e => { e.stopPropagation(); onGroupHover(g.id) }}
                            onMouseLeave={() => onGroupHover(null)}>
                            {g.label.replace('_', '')}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="kmap-hint">
        {form === 'SOP' ? 'Chuẩn tắc Tuyển (gom ô 1 và X)' : 'Chuẩn tắc Hội (gom ô 0 và X)'}
      </div>
    </div>
  )
}
