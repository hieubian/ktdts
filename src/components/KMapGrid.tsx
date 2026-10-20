import React, { useState } from 'react'
import type { CellValue, KMapGroup, OptimizationForm, VariableCount } from '../types'
import {
  cellToMinterm,
  formatGray,
  getColGrayCodes,
  getGridDimensions,
  getRowGrayCodes
} from '../utils/kmapSolver'
import { KaTeXView } from './KaTeXView'
import './KMapGrid.css'

interface KMapGridProps {
  variableCount: VariableCount
  gridValues: Record<number, CellValue>
  groups: KMapGroup[]
  form: OptimizationForm
  onCellToggle?: (minterm: number) => void
  hoveredGroup?: string | null
  onGroupHover?: (id: string | null) => void
}

export const KMapGrid: React.FC<KMapGridProps> = ({
  variableCount,
  gridValues,
  groups,
  form,
  onCellToggle,
  hoveredGroup,
  onGroupHover
}) => {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null)
  const { rowCount, colCount, rowVars, colVars } = getGridDimensions(variableCount)
  const rowGrays = getRowGrayCodes(variableCount)
  const colGrays = getColGrayCodes(variableCount)

  const getCellGroups = (minterm: number): KMapGroup[] => {
    return groups.filter((g) => g.cells.includes(minterm))
  }

  const isCellInHoveredGroup = (minterm: number): boolean => {
    if (!hoveredGroup) return false
    const group = groups.find((g) => g.id === hoveredGroup)
    if (!group) return false
    return group.cells.includes(minterm)
  }

  const handleCellClick = (minterm: number) => {
    if (onCellToggle) {
      onCellToggle(minterm)
    }
  }

  const renderCellValue = (minterm: number): React.ReactNode => {
    const value = gridValues[minterm]
    if (value === undefined) return '-'
    if (value === 'd' || value === 'X') return 'd'
    return value
  }

  const getCellClass = (minterm: number): string => {
    const value = gridValues[minterm]
    let classes = ['kmap-cell']

    if (value === 1) classes.push('cell-one')
    else if (value === 0) classes.push('cell-zero')
    else classes.push('cell-dontcare')

    if (isCellInHoveredGroup(minterm)) {
      classes.push('cell-hovered')
    } else if (hoveredCell === minterm) {
      classes.push('cell-mouseover')
    }

    return classes.join(' ')
  }

  const getCellStyle = (minterm: number): React.CSSProperties => {
    const cellGroups = getCellGroups(minterm)
    if (cellGroups.length === 0) return {}

    const primaryGroup = cellGroups[0]
    const isHovered = isCellInHoveredGroup(minterm)

    return {
      borderColor: primaryGroup.color,
      backgroundColor: isHovered
        ? primaryGroup.color
        : `${primaryGroup.color}${cellGroups.length > 1 ? '40' : '30'}`,
      color: isHovered ? 'white' : 'inherit',
      fontWeight: isHovered ? 600 : 400
    }
  }

  return (
    <div className="kmap-container">
      <div className="kmap-variables">
        <span className="var-label">
          Biến hàng: <strong>{rowVars.join(', ')}</strong>
        </span>
        <span className="var-label">
          Biến cột: <strong>{colVars.join(', ')}</strong>
        </span>
      </div>

      <div className="kmap-table-wrapper">
        <table className="kmap-table">
          <thead>
            <tr>
              <th className="corner-cell">
                <div className="var-row-label">{rowVars.join('')}</div>
                <div className="var-col-label">{colVars.join('')}</div>
              </th>
              {colGrays.map((code, colIdx) => (
                <th key={colIdx} className="header-cell">
                  {formatGray(code, colVars.length)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowGrays.map((rowCode, rowIdx) => (
              <tr key={rowIdx}>
                <th className="header-cell">{formatGray(rowCode, rowVars.length)}</th>
                {colGrays.map((colCode, colIdx) => {
                  const minterm = cellToMinterm(variableCount, rowIdx, colIdx)
                  const cellGroups = getCellGroups(minterm)

                  return (
                    <td
                      key={colIdx}
                      className={getCellClass(minterm)}
                      style={getCellStyle(minterm)}
                      onClick={() => handleCellClick(minterm)}
                      onMouseEnter={() => {
                        setHoveredCell(minterm)
                        if (cellGroups.length > 0 && onGroupHover) {
                          onGroupHover(cellGroups[0].id)
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredCell(null)
                        if (onGroupHover) onGroupHover(null)
                      }}
                    >
                      <div className="cell-value">{renderCellValue(minterm)}</div>
                      <div className="cell-minterm">{minterm}</div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {groups.length > 0 && (
        <div className="kmap-legend">
          <div className="legend-title">Các nhóm khoanh:</div>
          <div className="legend-items">
            {groups.map((group) => (
              <div
                key={group.id}
                className={`legend-item ${hoveredGroup === group.id ? 'active' : ''}`}
                onMouseEnter={() => onGroupHover && onGroupHover(group.id)}
                onMouseLeave={() => onGroupHover && onGroupHover(null)}
              >
                <span className="legend-color" style={{ backgroundColor: group.color }} />
                <span className="legend-label">
                  <KaTeXView math={group.label} /> = <KaTeXView math={group.termLatex} />
                </span>
                <span className="legend-cells">({group.cells.join(', ')})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
