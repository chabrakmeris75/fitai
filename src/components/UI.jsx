import { useState } from 'react'

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style, onClick, glow }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--bg2)',
      border: `0.5px solid ${glow ? 'rgba(124,111,247,0.4)' : 'var(--border)'}`,
      borderRadius: 'var(--r2)',
      padding: '16px 18px',
      boxShadow: glow ? '0 0 24px rgba(124,111,247,0.12)' : 'none',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  ok:      { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.25)' },
  warn:    { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
  danger:  { bg: 'rgba(248,113,113,0.12)', color: '#f87171', border: 'rgba(248,113,113,0.25)' },
  info:    { bg: 'rgba(124,111,247,0.15)', color: '#a78bfa', border: 'rgba(124,111,247,0.3)' },
  neutral: { bg: 'rgba(255,255,255,0.06)', color: 'rgba(240,240,245,0.5)', border: 'rgba(255,255,255,0.1)' },
  pr:      { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
}

export function Badge({ type = 'neutral', children, style }) {
  const s = BADGE_STYLES[type] || BADGE_STYLES.neutral
  return (
    <span style={{
      fontSize: 11, padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap',
      background: s.bg, color: s.color, border: `0.5px solid ${s.border}`,
      fontFamily: 'var(--font-mono)',
      ...style,
    }}>{children}</span>
  )
}

// ── MetricTile ────────────────────────────────────────────────────────────────
export function MetricTile({ label, value, unit, delta, deltaUp, style }) {
  return (
    <div style={{
      background: 'var(--bg3)', borderRadius: 'var(--r)', padding: '12px 14px',
      border: '0.5px solid var(--border)', ...style,
    }}>
      <p style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 600, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
        {value}
        {unit && <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text2)', marginLeft: 3 }}>{unit}</span>}
      </p>
      {delta && (
        <p style={{ fontSize: 11, marginTop: 4, color: deltaUp ? 'var(--green)' : 'var(--red)' }}>{delta}</p>
      )}
    </div>
  )
}

// ── ProgressBar ───────────────────────────────────────────────────────────────
export function ProgressBar({ value, max, color = 'var(--accent)', height = 4 }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div style={{ height, background: 'rgba(255,255,255,0.07)', borderRadius: height, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: height, transition: 'width .8s ease' }} />
    </div>
  )
}

// ── ScoreRing ─────────────────────────────────────────────────────────────────
export function ScoreRing({ score, size = 80, stroke = 7 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const fill = (score / 100) * circ
  const color = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171'
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1.2s ease' }} />
    </svg>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange, style }) {
  return (
    <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 10, padding: 3, gap: 2, ...style }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex: 1, padding: '6px 8px', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontSize: 12, fontFamily: 'var(--font)', fontWeight: active === t.id ? 500 : 400,
          background: active === t.id ? 'var(--bg2)' : 'transparent',
          color: active === t.id ? 'var(--text)' : 'var(--text2)',
          border: active === t.id ? '0.5px solid var(--border2)' : '0.5px solid transparent',
          transition: 'all .15s',
        }}>{t.label}</button>
      ))}
    </div>
  )
}

// ── SectionTitle ──────────────────────────────────────────────────────────────
export function SectionTitle({ children, action, actionLabel }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, letterSpacing: '-.01em' }}>{children}</h2>
      {action && (
        <button onClick={action} style={{
          background: 'none', border: 'none', cursor: 'pointer', fontSize: 12,
          color: 'var(--accent2)', fontFamily: 'var(--font)',
        }}>{actionLabel} →</button>
      )}
    </div>
  )
}

// ── BottomNav ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard', icon: '◈' },
  { id: 'workout',      label: 'Séance',    icon: '◉' },
  { id: 'coach',        label: 'Coach IA',  icon: '◎' },
  { id: 'program',      label: 'Programme', icon: '▦' },
  { id: 'sync',         label: 'Sync',      icon: '⟳' },
]

export function BottomNav({ active, onChange }) {
  return (
    <nav style={{
      display: 'flex', background: 'rgba(10,10,15,0.92)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: '0.5px solid var(--border)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      flexShrink: 0,
    }}>
      {NAV_ITEMS.map(item => (
        <button key={item.id} onClick={() => onChange(item.id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 3, padding: '10px 4px 8px', background: 'none', border: 'none',
          cursor: 'pointer', color: active === item.id ? 'var(--accent2)' : 'var(--text3)',
          transition: 'color .15s', fontSize: 9, fontFamily: 'var(--font)',
        }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{
      width: 18, height: 18, borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.1)',
      borderTopColor: 'var(--accent2)',
      animation: 'spin .7s linear infinite',
      display: 'inline-block',
    }} />
  )
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'primary', disabled, style }) {
  const styles = {
    primary: { background: 'var(--accent)', color: '#fff', border: '0.5px solid rgba(124,111,247,0.5)' },
    ghost:   { background: 'rgba(255,255,255,0.05)', color: 'var(--text2)', border: '0.5px solid var(--border)' },
    danger:  { background: 'rgba(248,113,113,0.12)', color: 'var(--red)', border: '0.5px solid rgba(248,113,113,0.25)' },
  }
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
      cursor: disabled ? 'default' : 'pointer', opacity: disabled ? .5 : 1,
      fontFamily: 'var(--font)', transition: 'opacity .15s',
      ...styles[variant], ...style,
    }}>{children}</button>
  )
}

// ── useLocalStorage ───────────────────────────────────────────────────────────
export function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial }
    catch { return initial }
  })
  const set = (v) => {
    const next = typeof v === 'function' ? v(val) : v
    setVal(next)
    try { localStorage.setItem(key, JSON.stringify(next)) } catch {}
  }
  return [val, set]
}
