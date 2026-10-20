import React from 'react'
import { HelpCircle, BookOpen, Home } from 'lucide-react'
import './Navbar.css'
import type { ProblemType } from '../App'

interface NavbarProps {
  currentProblem: ProblemType
  onProblemChange: (type: ProblemType) => void
  onOpenHelp: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProblem,
  onProblemChange,
  onOpenHelp
}) => {
  return (
    <nav className="navbar no-print">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Home className="navbar-icon" />
          <span className="navbar-title">Giải Bài Tập KTĐTS</span>
        </div>

        <div className="navbar-tabs">
          <button
            className={`navbar-tab ${currentProblem === 'type1' ? 'active' : ''}`}
            onClick={() => onProblemChange('type1')}
          >
            <span className="tab-number">1-3</span>
            <span className="tab-text">Rút gọn hàm</span>
          </button>
          <button
            className={`navbar-tab ${currentProblem === 'type2' ? 'active' : ''}`}
            onClick={() => onProblemChange('type2')}
          >
            <span className="tab-number">4-5</span>
            <span className="tab-text">Mạch theo quy tắc</span>
          </button>
          <button
            className={`navbar-tab ${currentProblem === 'type3' ? 'active' : ''}`}
            onClick={() => onProblemChange('type3')}
          >
            <span className="tab-number">6-7</span>
            <span className="tab-text">Chuyển mã</span>
          </button>
          <button
            className={`navbar-tab ${currentProblem === 'type4' ? 'active' : ''}`}
            onClick={() => onProblemChange('type4')}
          >
            <span className="tab-number">8-9</span>
            <span className="tab-text">LED 7 đoạn</span>
          </button>
        </div>

        <div className="navbar-actions">
          <button className="navbar-action-btn" onClick={onOpenHelp} title="Hướng dẫn">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}
