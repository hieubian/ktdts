import React from 'react'
import './App.css'
import { Navbar } from './components/Navbar'
import { HelpModal } from './components/HelpModal'
import { ProblemType1Page } from './pages/ProblemType1Page'
import { ProblemType2Page } from './pages/ProblemType2Page'
import { ProblemType3Page } from './pages/ProblemType3Page'
import { ProblemType4Page } from './pages/ProblemType4Page'

export type ProblemType = 'type1' | 'type2' | 'type3' | 'type4'

const App: React.FC = () => {
  const [currentProblem, setCurrentProblem] = React.useState<ProblemType>('type1')
  const [isHelpOpen, setIsHelpOpen] = React.useState(false)

  const renderPage = () => {
    switch (currentProblem) {
      case 'type1':
        return <ProblemType1Page />
      case 'type2':
        return <ProblemType2Page />
      case 'type3':
        return <ProblemType3Page />
      case 'type4':
        return <ProblemType4Page />
    }
  }

  return (
    <div className="app">
      <Navbar
        currentProblem={currentProblem}
        onProblemChange={setCurrentProblem}
        onOpenHelp={() => setIsHelpOpen(true)}
      />
      <main className="main-content">
        {renderPage()}
      </main>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  )
}

export default App
