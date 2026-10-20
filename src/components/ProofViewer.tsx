import React, { useState } from 'react'
import type { TransformationStep } from '../types'
import { KaTeXView } from './KaTeXView'
import { FormattedMathText } from './FormattedMathText'
import { Check, ChevronDown, ChevronUp, Copy, HelpCircle } from 'lucide-react'

interface ProofViewerProps {
  steps: TransformationStep[]
  funcName?: string
}

export const ProofViewer: React.FC<ProofViewerProps> = ({ steps, funcName = 'Y' }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const copyStepLatex = (latex: string, idx: number) => {
    navigator.clipboard.writeText(latex)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const finalStep = steps[steps.length - 1]

  return (
    <div>
      {/* Summary result */}
      <div className="result-box" style={{ marginTop: 0, marginBottom: 'var(--space-md)' }}>
        <div className="result-label">
          <span>Kết quả sau biến đổi:</span>
        </div>
        <div className="result-math">
          <KaTeXView math={finalStep ? finalStep.latex : `${funcName} = 0`} block={true} />
        </div>
      </div>

      {/* Toggle */}
      <button className="action-btn" onClick={() => setIsOpen(prev => !prev)}
        style={{ marginBottom: 'var(--space-md)' }}>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        <span>{isOpen ? 'Thu gọn các bước' : 'Xem chi tiết từng bước biến đổi'}</span>
      </button>

      {isOpen && (
        <>
          {/* Laws reference */}
          <div className="info-box" style={{ marginBottom: 'var(--space-md)', marginTop: 0 }}>
            <HelpCircle size={16} />
            <div>
              <p><strong>Các định luật áp dụng:</strong></p>
              <p style={{ marginTop: 4 }}>
                1. <strong>Hoàn nguyên:</strong> <KaTeXView math="\overline{\overline{A}} = A" /> &nbsp;|&nbsp;
                2. <strong>De Morgan:</strong> <KaTeXView math="\overline{A+B} = \overline{A}\cdot\overline{B}" /> và <KaTeXView math="\overline{A \cdot B} = \overline{A} + \overline{B}" />
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="proof-steps">
            {steps.map((step, idx) => {
              const isCopied = copiedIdx === idx
              const cleanTitle = step.title.replace(/^Bước\s+\d+[:.]?\s*/i, '')

              return (
                <div key={idx} className="proof-step">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 24, height: 24, borderRadius: '50%', background: 'var(--gradient-primary)',
                        color: 'white', fontSize: '11px', fontWeight: 700, flexShrink: 0
                      }}>{idx + 1}</span>
                      <span className="proof-step-title">{cleanTitle}</span>
                    </div>
                    <button className="action-btn" onClick={() => copyStepLatex(step.latex, idx)}
                      style={{ fontSize: '10px', padding: '3px 8px' }}>
                      {isCopied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{isCopied ? 'Đã copy' : 'LaTeX'}</span>
                    </button>
                  </div>

                  {step.ruleName && (
                    <div className="proof-step-rule">
                      {step.ruleName}
                      {step.ruleFormula && (
                        <span style={{ marginLeft: 8 }}>
                          <KaTeXView math={step.ruleFormula} />
                        </span>
                      )}
                    </div>
                  )}

                  <p className="proof-step-desc">
                    <FormattedMathText text={step.description} />
                  </p>

                  <div className="proof-step-math">
                    <KaTeXView math={step.latex} block={true} />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
