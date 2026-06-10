import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card, Badge, Tabs, SectionTitle, Btn, ProgressBar, useLocalStorage } from '../components/UI.jsx'
import { WORKOUTS, EXERCISE_LIBRARY, MUSCLE_VOLUME } from '../data/mockData.js'

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1a1a24', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 12px', fontSize: 11 }}>
      <p style={{ color: 'var(--text3)', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color, fontWeight: 500 }}>{p.value} kg</p>)}
    </div>
  )
}

function est1RM(kg, reps) {
  if (!kg || !reps) return null
  return Math.round(kg * (1 + reps / 30) * 10) / 10
}

function progressionData(name) {
  const base = { 'Développé couché': 80, 'Squat barre': 100, 'Soulevé de terre': 120, 'Tractions': 15, 'Développé militaire': 60 }
  const start = base[name] || 50
  return Array.from({ length: 8 }, (_, i) => ({
    s: `S${i + 1}`,
    kg: Math.round((start + i * 2.5 + (Math.random() - 0.3) * 3) * 2) / 2,
  }))
}

// ── Set Row ────────────────────────────────────────────────────────────────────
function SetRow({ n, set, onChange, onDelete }) {
  const orm = est1RM(set.kg, set.reps)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '22px 1fr 1fr 60px 1fr 26px', gap: 6, alignItems: 'center', marginBottom: 6 }}>
      <span style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{n}</span>
      <input
        type="number" placeholder="kg" value={set.kg || ''}
        onChange={e => onChange('kg', parseFloat(e.target.value) || 0)}
        style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '7px 8px', fontSize: 13, width: '100%', outline: 'none' }}
      />
      <input
        type="number" placeholder="reps" value={set.reps || ''}
        onChange={e => onChange('reps', parseInt(e.target.value) || 0)}
        style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '7px 8px', fontSize: 13, width: '100%', outline: 'none' }}
      />
      <select
        value={set.rpe || ''} onChange={e => onChange('rpe', e.target.value)}
        style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '7px 4px', fontSize: 11, width: '100%', outline: 'none' }}
      >
        <option value="">RPE</option>
        {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(v => <option key={v} value={v}>{v}</option>)}
      </select>
      <span style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
        {orm ? `${orm}` : '—'}
      </span>
      <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
    </div>
  )
}

// ── Exercise Block ─────────────────────────────────────────────────────────────
function ExBlock({ ex, onChange, onDelete }) {
  const vol = ex.sets.reduce((a, s) => a + (s.kg * s.reps), 0)
  const hasPR = ex.sets.some(s => s.kg > (ex.prThresh || 0))

  function updateSet(i, field, val) {
    const sets = ex.sets.map((s, j) => j === i ? { ...s, [field]: val } : s)
    onChange({ ...ex, sets })
  }
  function addSet() {
    onChange({ ...ex, sets: [...ex.sets, { kg: 0, reps: 0, rpe: '' }] })
  }
  function deleteSet(i) {
    onChange({ ...ex, sets: ex.sets.filter((_, j) => j !== i) })
  }

  return (
    <div style={{ background: 'var(--bg3)', borderRadius: 14, padding: '12px 14px', marginBottom: 10, border: '0.5px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 15 }}>◈</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{ex.name}</span>
          {hasPR && <Badge type="pr">PR !</Badge>}
        </div>
        <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text3)', padding: 0 }}>×</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '22px 1fr 1fr 60px 1fr 26px', gap: 6, marginBottom: 6 }}>
        {['#', 'Charge', 'Reps', 'RPE', '1RM', ''].map((h, i) => (
          <span key={i} style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', textAlign: i === 0 || i === 4 ? 'center' : 'left' }}>{h}</span>
        ))}
      </div>

      {ex.sets.map((s, i) => (
        <SetRow key={i} n={i + 1} set={s} onChange={(f, v) => updateSet(i, f, v)} onDelete={() => deleteSet(i)} />
      ))}

      <button onClick={addSet} style={{
        width: '100%', padding: '7px', borderRadius: 8, fontSize: 12,
        background: 'none', border: '0.5px dashed var(--border2)', color: 'var(--text2)',
        cursor: 'pointer', fontFamily: 'var(--font)', marginTop: 4,
      }}>+ Série</button>

      <div style={{ marginTop: 8, display: 'flex', gap: 12, fontSize: 11, color: 'var(--text3)' }}>
        <span>Vol : <strong style={{ color: 'var(--text)' }}>{vol.toLocaleString('fr-FR')} kg</strong></span>
        <span>Séries : <strong style={{ color: 'var(--text)' }}>{ex.sets.filter(s => s.kg > 0 && s.reps > 0).length}</strong></span>
      </div>
    </div>
  )
}

// ── Main Workout Page ──────────────────────────────────────────────────────────
export default function Workout() {
  const [tab, setTab] = useState('log')
  const [exercises, setExercises] = useLocalStorage('fitai_workout', [])
  const [timer, setTimer] = useState(0)
  const [running, setRunning] = useState(false)
  const [timerRef, setTimerRef] = useState(null)
  const [progEx, setProgEx] = useState('Développé couché')
  const [showPicker, setShowPicker] = useState(false)
  const [search, setSearch] = useState('')

  const totalVol = exercises.reduce((a, ex) => a + ex.sets.reduce((b, s) => b + s.kg * s.reps, 0), 0)
  const mins = String(Math.floor(timer / 60)).padStart(2, '0')
  const secs = String(timer % 60).padStart(2, '0')

  function toggleTimer() {
    if (running) {
      clearInterval(timerRef); setRunning(false)
    } else {
      const iv = setInterval(() => setTimer(t => t + 1), 1000)
      setTimerRef(iv); setRunning(true)
    }
  }

  function addExercise(name) {
    setExercises(prev => [...prev, { id: Date.now(), name, sets: [{ kg: 0, reps: 0, rpe: '' }], prThresh: 0 }])
    setShowPicker(false); setSearch('')
  }

  const filtered = EXERCISE_LIBRARY.filter(e => e.toLowerCase().includes(search.toLowerCase()))

  const progData = progressionData(progEx)
  const lastKg = progData[progData.length - 1]?.kg || 0
  const prevKg = progData[0]?.kg || 0

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px 16px 8px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>Journal de séance</h1>
        <Tabs
          tabs={[{ id: 'log', label: 'Séance' }, { id: 'prog', label: 'Progression' }, { id: 'hist', label: 'Historique' }]}
          active={tab}
          onChange={setTab}
          style={{ width: 190 }}
        />
      </div>

      {/* ── LOG ── */}
      {tab === 'log' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Type', value: 'Push' },
              { label: 'Durée', value: `${mins}:${secs}` },
              { label: 'Volume', value: totalVol > 0 ? `${Math.round(totalVol / 100) / 10}k` : '0' },
              { label: 'Exercices', value: exercises.length },
            ].map((m, i) => (
              <div key={i} style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px', border: '0.5px solid var(--border)', textAlign: 'center' }}>
                <p style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>{m.label}</p>
                <p style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)' }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Quick add buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {['Développé couché', 'Squat barre', 'Soulevé de terre', 'Tractions'].map(n => (
              <button key={n} onClick={() => addExercise(n)} style={{
                padding: '5px 11px', borderRadius: 20, fontSize: 11, background: 'var(--bg3)',
                border: '0.5px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', fontFamily: 'var(--font)',
              }}>+ {n}</button>
            ))}
            <button onClick={() => setShowPicker(true)} style={{
              padding: '5px 11px', borderRadius: 20, fontSize: 11, background: 'rgba(124,111,247,0.1)',
              border: '0.5px solid rgba(124,111,247,0.25)', color: 'var(--accent2)', cursor: 'pointer', fontFamily: 'var(--font)',
            }}>+ Autre</button>
          </div>

          {/* Exercise picker */}
          {showPicker && (
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border2)', borderRadius: 14, padding: 14, marginBottom: 12 }}>
              <input
                placeholder="Rechercher ou créer..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
                style={{ width: '100%', background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', marginBottom: 10 }}
              />
              <div style={{ maxHeight: 140, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {search && !EXERCISE_LIBRARY.includes(search) && (
                  <button onClick={() => addExercise(search)} style={{ padding: '5px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(52,211,153,0.1)', border: '0.5px solid rgba(52,211,153,0.25)', color: 'var(--green)', cursor: 'pointer', fontFamily: 'var(--font)' }}>
                    + Créer "{search}"
                  </button>
                )}
                {filtered.map(n => (
                  <button key={n} onClick={() => addExercise(n)} style={{ padding: '5px 10px', borderRadius: 20, fontSize: 11, background: 'var(--bg3)', border: '0.5px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', fontFamily: 'var(--font)' }}>{n}</button>
                ))}
              </div>
            </div>
          )}

          {exercises.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>◈</div>
              <p style={{ fontSize: 13 }}>Ajoute ton premier exercice ci-dessus</p>
            </div>
          )}

          {exercises.map((ex, i) => (
            <ExBlock key={ex.id} ex={ex}
              onChange={updated => setExercises(prev => prev.map((e, j) => j === i ? updated : e))}
              onDelete={() => setExercises(prev => prev.filter((_, j) => j !== i))}
            />
          ))}

          {/* Controls */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button onClick={toggleTimer} style={{
              padding: '10px 14px', borderRadius: 10, fontSize: 12, background: running ? 'rgba(248,113,113,0.12)' : 'var(--bg3)',
              border: `0.5px solid ${running ? 'rgba(248,113,113,0.3)' : 'var(--border)'}`,
              color: running ? 'var(--red)' : 'var(--text2)', cursor: 'pointer', fontFamily: 'var(--font)',
            }}>{running ? '⏸ Pause' : '▶ Timer'}</button>
            {exercises.length > 0 && (
              <button onClick={() => setExercises([])} style={{
                flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                background: 'var(--accent)', border: '0.5px solid rgba(124,111,247,0.4)',
                color: '#fff', cursor: 'pointer', fontFamily: 'var(--font)',
              }}>✓ Terminer la séance</button>
            )}
          </div>
        </>
      )}

      {/* ── PROGRESSION ── */}
      {tab === 'prog' && (
        <>
          <select value={progEx} onChange={e => setProgEx(e.target.value)} style={{
            width: '100%', background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 10,
            padding: '10px 12px', fontSize: 13, marginBottom: 14, outline: 'none',
          }}>
            {['Développé couché', 'Squat barre', 'Soulevé de terre', 'Tractions', 'Développé militaire'].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <Card style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>{lastKg} <span style={{ fontSize: 15, fontWeight: 400, color: 'var(--text2)' }}>kg</span></span>
              <Badge type="ok">+{Math.round((lastKg - prevKg) * 10) / 10} kg / 8 sem</Badge>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 14 }}>1RM estimé : {est1RM(lastKg, 5)} kg</p>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={progData}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="s" tick={{ fill: 'rgba(240,240,245,.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(240,240,245,.2)', fontSize: 10 }} axisLine={false} tickLine={false} width={32} domain={['auto', 'auto']} />
                <Tooltip content={<TT />} />
                <Line type="monotone" dataKey="kg" stroke="var(--accent2)" strokeWidth={2} dot={{ fill: 'var(--accent2)', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <SectionTitle>Volume par groupe musculaire</SectionTitle>
            {MUSCLE_VOLUME.map(m => {
              const pct = Math.round(Math.min(100, (m.sets / m.target) * 100))
              const color = pct >= 100 ? 'var(--green)' : pct >= 70 ? 'var(--amber)' : 'var(--red)'
              return (
                <div key={m.name} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                    <span style={{ color: 'var(--text2)' }}>{m.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color }}>{m.sets}/{m.target} séries</span>
                  </div>
                  <ProgressBar value={m.sets} max={m.target} color={color} height={5} />
                </div>
              )
            })}
          </Card>
        </>
      )}

      {/* ── HISTORIQUE ── */}
      {tab === 'hist' && (
        <Card>
          <SectionTitle>Séances récentes</SectionTitle>
          {WORKOUTS.map((w, i) => (
            <div key={w.id} style={{ padding: '12px 0', borderBottom: i < WORKOUTS.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {w.type === 'Push' ? '⬆' : w.type === 'Pull' ? '⬇' : '⬡'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>{w.name}</span>
                    {w.pr && <Badge type="pr">PR</Badge>}
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text3)' }}>{w.date} · {w.duration} min · {w.volume.toLocaleString('fr-FR')} kg</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {w.exercises.map(e => (
                  <span key={e.name} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'var(--bg3)', color: 'var(--text3)' }}>{e.name}</span>
                ))}
              </div>
            </div>
          ))}
        </Card>
      )}

      <div style={{ height: 8 }} />
    </div>
  )
}
