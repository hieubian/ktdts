import React, { useRef, useState } from 'react'
import type { CircuitDiagram, CircuitNode } from '../types'
import { Download, Image, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'

interface CircuitViewerProps {
  diagram: CircuitDiagram
  title: string
  subtitle?: string
}

function formatSubscriptStr(str: string): string {
  return str
    .replace(/_0/g, '₀').replace(/_1/g, '₁').replace(/_2/g, '₂').replace(/_3/g, '₃')
    .replace(/_4/g, '₄').replace(/_5/g, '₅').replace(/_6/g, '₆').replace(/_7/g, '₇')
    .replace(/_8/g, '₈').replace(/_9/g, '₉')
}

export const CircuitViewer: React.FC<CircuitViewerProps> = ({ diagram, title, subtitle }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }
  const handleMouseUp = () => setIsDragging(false)

  const handleExportSvg = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `circuit.svg`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPng = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new window.Image()
    canvas.width = diagram.width * 2
    canvas.height = diagram.height * 2
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const pngUrl = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = pngUrl
        link.download = `circuit.png`
        link.click()
      }
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  const renderGateLabel = (label: string) => {
    const formatted = formatSubscriptStr(label)
    const chars = Array.from(formatted)
    const elements: { char: string; inverted: boolean }[] = []
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i]
      if (c === '\u0304') {
        if (elements.length > 0) elements[elements.length - 1].inverted = true
      } else {
        elements.push({ char: c, inverted: false })
      }
    }
    const charWidth = 8.5
    const totalWidth = elements.length * charWidth
    const startX = -totalWidth / 2

    return (
      <g>
        {elements.map((el, i) => {
          const cx = startX + i * charWidth + charWidth / 2
          return (
            <g key={i}>
              <text x={cx} y="-23" textAnchor="middle" fontSize="11" fontWeight="600"
                fill="var(--text-primary)" fontFamily="var(--font-mono)">{el.char}</text>
              {el.inverted && (
                <line x1={cx - 4} y1="-31.5" x2={cx + 4} y2="-31.5"
                  stroke="var(--accent-rose)" strokeWidth="1.5" />
              )}
            </g>
          )
        })}
      </g>
    )
  }

  const renderGateSymbol = (node: CircuitNode) => {
    const stroke = 'var(--text-secondary)'
    const fill = 'none'
    const bubbleFill = 'var(--bg-surface)'

    if (node.id.startsWith('lbl-not-') || node.id.startsWith('in-not-')) {
      const char = node.label?.replace(/̄/g, '').replace(/\u0304/g, '') || ''
      return (
        <g transform={`translate(${node.x}, ${node.y})`}>
          <rect x="-14" y="-16" width="28" height="28" rx="6"
            fill="var(--bg-elevated)" stroke={stroke} strokeWidth="1" />
          <text x="0" y="6" textAnchor="middle" fontSize="13" fontWeight="700"
            fill="var(--text-primary)" fontFamily="var(--font-mono)">{char}</text>
          <line x1="-7" y1="-9.5" x2="7" y2="-9.5" stroke="var(--accent-rose)" strokeWidth="1.5" />
        </g>
      )
    }

    if (node.id.startsWith('not-') || node.id.startsWith('tied-not-')) {
      return (
        <g transform={`translate(${node.x}, ${node.y})`}>
          <path d="M -11 -12 L 11 -12 L 0 6 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <circle cx="0" cy="11" r="3.5" fill={bubbleFill} stroke={stroke} strokeWidth="1.5" />
        </g>
      )
    }

    switch (node.type) {
      case 'and':
        return (
          <g transform={`translate(${node.x}, ${node.y})`}>
            <path d="M -20 -18 H 0 A 18 18 0 0 1 0 18 H -20 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
            {node.label && renderGateLabel(node.label)}
          </g>
        )
      case 'or':
        return (
          <g transform={`translate(${node.x}, ${node.y})`}>
            <path d="M -20 -18 Q -6 0 -20 18 Q 8 18 20 0 Q 8 -18 -20 -18 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
            {node.label && renderGateLabel(node.label)}
          </g>
        )
      case 'nand':
        return (
          <g transform={`translate(${node.x}, ${node.y})`}>
            <path d="M -20 -18 H 0 A 18 18 0 0 1 0 18 H -20 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <circle cx="23" cy="0" r="3.5" fill={bubbleFill} stroke={stroke} strokeWidth="1.5" />
            {node.label && renderGateLabel(node.label)}
          </g>
        )
      case 'nor':
        return (
          <g transform={`translate(${node.x}, ${node.y})`}>
            <path d="M -20 -18 Q -6 0 -20 18 Q 8 18 20 0 Q 8 -18 -20 -18 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <circle cx="23" cy="0" r="3.5" fill={bubbleFill} stroke={stroke} strokeWidth="1.5" />
            {node.label && renderGateLabel(node.label)}
          </g>
        )
      case 'input':
        return (
          <g transform={`translate(${node.x}, ${node.y})`}>
            <circle cx="0" cy="0" r="13" fill="var(--bg-elevated)" stroke="var(--accent-blue)" strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fontSize="12" fontWeight="700"
              fill="var(--accent-blue)" fontFamily="var(--font-mono)">{node.label}</text>
          </g>
        )
      case 'output':
        return (
          <g transform={`translate(${node.x}, ${node.y})`}>
            <circle cx="0" cy="0" r="15" fill="rgba(52, 211, 153, 0.1)" stroke="var(--accent-emerald)" strokeWidth="2" />
            <text x="0" y="5" textAnchor="middle" fontSize="13" fontWeight="800"
              fill="var(--accent-emerald)" fontFamily="var(--font-mono)">{node.label ? formatSubscriptStr(node.label) : ''}</text>
          </g>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-heading)' }}>{title}</div>
          {subtitle && <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{subtitle}</div>}
        </div>
        <div className="quick-actions">
          <button className="action-btn" onClick={() => setScale(s => Math.min(2.5, s + 0.15))}><ZoomIn size={14} /></button>
          <button className="action-btn" onClick={() => setScale(s => Math.max(0.4, s - 0.15))}><ZoomOut size={14} /></button>
          <button className="action-btn" onClick={() => { setScale(1); setPan({ x: 0, y: 0 }) }}><RotateCcw size={14} /></button>
          <button className="action-btn" onClick={handleExportSvg}><Download size={14} /> SVG</button>
          <button className="action-btn" onClick={handleExportPng}><Image size={14} /> PNG</button>
        </div>
      </div>

      <div className="circuit-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', minHeight: Math.min(diagram.height * scale + 40, 500) }}>
        <svg ref={svgRef} width="100%" height="100%"
          viewBox={`0 0 ${diagram.width} ${diagram.height}`}
          style={{ display: 'block' }}>
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
            {/* Bus wires */}
            {Object.entries(diagram.railXMap).map(([key, rx]) => (
              <line key={key}
                x1={rx} y1={key.startsWith('~') ? 126 : 42}
                x2={rx} y2={diagram.height - 25}
                stroke={key.startsWith('~') ? 'var(--accent-rose)' : 'var(--accent-blue)'}
                strokeWidth="1" strokeDasharray={key.startsWith('~') ? '4,2' : 'none'}
                opacity="0.4" />
            ))}

            {/* Signal wires */}
            {diagram.wires.map((wire, idx) => {
              if (wire.points.length < 2) return null
              const d = wire.points.map((pt, pIdx) => `${pIdx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')
              return <path key={idx} d={d} fill="none" stroke="var(--text-tertiary)" strokeWidth="1.2" />
            })}

            {/* Taps */}
            {diagram.taps.map((tap, idx) => (
              <circle key={idx} cx={tap.x} cy={tap.y} r="3" fill="var(--text-secondary)" />
            ))}

            {/* Gates */}
            {diagram.nodes.map(node => (
              <React.Fragment key={node.id}>
                {renderGateSymbol(node)}
              </React.Fragment>
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
