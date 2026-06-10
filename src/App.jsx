import { useState } from 'react'
import { BottomNav } from './components/UI.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Workout from './pages/Workout.jsx'
import Coach from './pages/Coach.jsx'
import Program from './pages/Program.jsx'
import Sync from './pages/Sync.jsx'

export default function App() {
  const [page, setPage] = useState('dashboard')

  const pages = {
    dashboard: <Dashboard onNavigate={setPage} />,
    workout:   <Workout />,
    coach:     <Coach />,
    program:   <Program onNavigate={setPage} />,
    sync:      <Sync onNavigate={setPage} />,
  }

  return (
    <div style={{
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 430,
      margin: '0 auto',
      position: 'relative',
      background: 'var(--bg)',
    }}>
      {/* Ambient glow background */}
      <div style={{
        position: 'fixed',
        top: -100,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,111,247,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Safe area top spacer for iPhone notch */}
      <div style={{ height: 'env(safe-area-inset-top)', flexShrink: 0, background: 'var(--bg)', zIndex: 10 }} />

      {/* Page content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {Object.entries(pages).map(([id, component]) => (
          <div key={id} style={{
            position: 'absolute', inset: 0,
            opacity: page === id ? 1 : 0,
            pointerEvents: page === id ? 'auto' : 'none',
            transition: 'opacity .2s ease',
          }}>
            {component}
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <BottomNav active={page} onChange={setPage} />
      </div>
    </div>
  )
}
