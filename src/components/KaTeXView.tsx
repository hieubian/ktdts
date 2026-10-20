import React from 'react'
import katex from 'katex'
import './KaTeXView.css'

interface KaTeXViewProps {
  math: string
  block?: boolean
  className?: string
}

export const KaTeXView: React.FC<KaTeXViewProps> = ({ math, block = false, className = '' }) => {
  let html = ''

  try {
    html = katex.renderToString(math, {
      throwOnError: false,
      displayMode: block,
      output: 'html'
    })
  } catch (err) {
    console.error('KaTeX render error:', err)
    html = `<span class="katex-error">${math}</span>`
  }

  if (block) {
    return <div className={`katex-block ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
  }

  return <span className={`katex-inline ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}
