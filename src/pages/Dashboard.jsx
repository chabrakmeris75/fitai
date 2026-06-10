import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { Card, Badge, MetricTile, ProgressBar, ScoreRing, SectionTitle, Tabs } from '../components/UI.jsx'
import { SLEEP_DATA, WEIGHT_DATA, CALORIES_DATA, TODAY_NUTRITION, WORKOUTS, MUSCLE_VOLUME } from '../data/mockData.js'
import { useHealthData, formatSleep, calcFormeScore } from '../hooks/useHealthData.js'

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1a1a24', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 12px', fontSize: 11 }}>
      <p style={{ color: 'var(--text3)', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 500 }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

function MacroRow({ label, g, target, color }) {
  const pct = Math.round(Math.min(100, (g / target) * 100))
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
        <span style={{ color: 'var(--text2)' }}>{label}</span>
        <span style={{ fontWeight: 500 }}>{g}g <span style={{ color: 'var(--text3)', fontWeight: 400 }}>/ {target}g</span></span>
      </div>
      <ProgressBar value={g} max={target} color={color} height={5} />
    </div>
  )
}

export default function Dashboard({ onNavigate }) {
  const [period, setPeriod] = useState('semaine')
  const { data: healthData, loading, lastSync, error, refresh } = useHealthData()

  const score = calcFormeScore(healthData)
  const sleepStr = formatSleep(healthData) || '—'
  const weight = healthData?.weight ? `${healthData.weight.toFixed(1)}` : '80.9'
  const steps = healthData?.steps ? healthData.steps.toLocaleString('fr-FR') : '—'
  const restingHr = healthData?.resting_hr || '—'
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px 16px 8px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, animation: 'fadeUp .4s ease' }}>
        <div>
          <p style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{today}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', marginTop: 2 }}>
            Tableau de bord
          </h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <Tabs
            tabs={[{ id: 'semaine', label: '7j' }, { id: 'mois', label: '30j' }, { id: '3mois', label: '3m' }]}
            active={period}
            onChange={setPeriod}
            style={{ width: 130 }}
          />
          <button onClick={refresh} disabled={loading} style={{
            fontSize: 11, color: loading ? 'var(--text3)' : 'var(--accent2)',
            background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {loading ? '⟳ Sync...' : lastSync ? `⟳ Sync ${lastSync}` : '⟳ Sync'}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ background: 'rgba(251,191,36,0.08)', border: '0.5px solid rgba(251,191,36,0.2)', borderRadius: 10, padding: '8px 12px', marginBottom: 12, fontSize: 12, color: 'var(--amber)' }}>
          ⚠ {error}
        </div>
      )}

      {/* Sync banner if no real data */}
      {!healthData && !loading && (
        <div style={{ background: 'rgba(124,111,247,0.08)', border: '0.5px solid rgba(124,111,247,0.2)', borderRadius: 10, padding: '8px 12px', marginBottom: 12, fontSize: 12, color: 'var(--accent2)' }}>
          ◎ Lance un Manual Export dans Health Auto Export pour voir tes vraies données
        </div>
      )}

      {/* Score + KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr', gap: 10, marginBottom: 12, animation: 'fadeUp .45s ease' }}>
        <Card glow style={{ padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <div style={{ position: 'relative', width: 64, height: 64 }}>
            <ScoreRing score={score} size={64} stroke={6} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700 }}>{score}</span>
            </div>
          </div>
          <span style={{ fontSize: 10, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>FORME</span>
        </Card>
        <MetricTile
          label="Poids"
          value={weight}
          unit="kg"
          delta={healthData?.weight ? '✓ Renpho' : 'Simulé'}
          deltaUp={!!healthData?.weight}
        />
        <MetricTile
          label="Sommeil"
          value={sleepStr}
          delta={healthData?.sleep?.inBed ? '✓ Zepp' : 'Simulé'}
          deltaUp={!!healthData?.sleep?.inBed}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18, animation: 'fadeUp .5s ease' }}>
        <MetricTile
          label="FC repos"
          value={restingHr}
          unit={restingHr !== '—' ? 'bpm' : ''}
          delta={healthData?.resting_hr ? '✓ Zepp' : 'Simulé'}
          deltaUp={!!healthData?.resting_hr}
        />
        <MetricTile
          label="Pas"
          value={steps}
          delta={healthData?.steps ? '✓ Zepp' : 'Simulé'}
          deltaUp={!!healthData?.steps}
        />
        <MetricTile
          label="Calories"
          value={healthData?.calories || '2 200'}
          unit="kcal"
          delta={healthData?.calories ? '✓ Crono' : 'Simulé'}
          deltaUp={!!healthData?.calories}
        />
      </div>

      {/* Sommeil réel */}
      {healthData?.sleep && (
        <div style={{ marginBottom: 14, animation: 'fadeUp .52s ease' }}>
          <Card glow>
            <SectionTitle>Sommeil — données réelles Zepp</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {[
                { label: 'Au lit', value: formatSleep(healthData) },
                { label: 'Profond', value: healthData.sleep.deep ? `${(healthData.sleep.deep * 60).toFixed(0)}min` : '—' },
                { label: 'REM', value: healthData.sleep.rem ? `${(healthData.sleep.rem * 60).toFixed(0)}min` : '—' },
                { label: 'Léger', value: healthData.sleep.core ? `${(healthData.sleep.core * 60).toFixed(0)}min` : '—' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'var(--bg3)', borderRadius: 10, padding: '8px', textAlign: 'center', border: '0.5px solid var(--border)' }}>
                  <p style={{ margin: '0 0 3px', fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)' }}>{s.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Calories chart */}
      <div style={{ marginBottom: 14, animation: 'fadeUp .55s ease' }}>
        <Card>
          <SectionTitle>Balance calorique — semaine</SectionTitle>
          <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--text3)', marginBottom: 10 }}>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--accent)', marginRight: 4, verticalAlign: -1 }} />Ingéré</span>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--green)', marginRight: 4, verticalAlign: -1 }} />Brûlé</span>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={CALORIES_DATA} barGap={3}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: 'rgba(240,240,245,.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(240,240,245,.2)', fontSize: 10 }} axisLine={false} tickLine={false} width={36} domain={[1500, 3200]} />
              <Tooltip content={<TT />} />
              <Bar dataKey="ingested" name="Ingéré" fill="var(--accent)" radius={[3, 3, 0, 0]} fillOpacity={0.85} barSize={14} />
              <Bar dataKey="burned" name="Brûlé" fill="var(--green)" radius={[3, 3, 0, 0]} fillOpacity={0.75} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Composition */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14, animation: 'fadeUp .6s ease' }}>
        <Card>
          <SectionTitle>Composition</SectionTitle>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={WEIGHT_DATA}>
              <defs>
                <linearGradient id="gMuscle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gFat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: 'rgba(240,240,245,.25)', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="muscle" name="Muscle" stroke="#34d399" strokeWidth={1.5} fill="url(#gMuscle)" dot={false} />
              <Area type="monotone" dataKey="fat" name="Graisse" stroke="#f87171" strokeWidth={1.5} fill="url(#gFat)" dot={false} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>Sommeil 7j</SectionTitle>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={SLEEP_DATA}>
              <XAxis dataKey="day" tick={{ fill: 'rgba(240,240,245,.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} />
              <Bar dataKey="hours" name="Heures" radius={[3, 3, 0, 0]} barSize={20}
                shape={(props) => {
                  const { x, y, width, height, value } = props
                  const color = value >= 7.5 ? '#34d399' : value >= 6.5 ? '#fbbf24' : '#f87171'
                  return <rect x={x} y={y} width={width} height={height} fill={color} fillOpacity={0.8} rx={3} />
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Macros */}
      <div style={{ marginBottom: 14, animation: 'fadeUp .65s ease' }}>
        <Card>
          <SectionTitle>Macros du jour</SectionTitle>
          <MacroRow label="Protéines" g={healthData?.protein || TODAY_NUTRITION.protein.g} target={TODAY_NUTRITION.protein.target} color="var(--accent2)" />
          <MacroRow label="Glucides" g={TODAY_NUTRITION.carbs.g} target={TODAY_NUTRITION.carbs.target} color="var(--blue)" />
          <MacroRow label="Lipides" g={TODAY_NUTRITION.fat.g} target={TODAY_NUTRITION.fat.target} color="var(--amber)" />
        </Card>
      </div>

      {/* Recent workouts */}
      <div style={{ marginBottom: 14, animation: 'fadeUp .7s ease' }}>
        <Card>
          <SectionTitle action={() => onNavigate('workout')} actionLabel="Voir tout">Séances récentes</SectionTitle>
          {WORKOUTS.map((w, i) => (
            <div key={w.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
              borderBottom: i < WORKOUTS.length - 1 ? '0.5px solid var(--border)' : 'none',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: w.pr ? 'rgba(124,111,247,0.15)' : 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                {w.type === 'Push' ? '⬆' : w.type === 'Pull' ? '⬇' : '⬡'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text3)' }}>{w.date} · {w.duration} min · {w.volume.toLocaleString('fr-FR')} kg</p>
              </div>
              {w.pr && <Badge type="pr">PR</Badge>}
            </div>
          ))}
        </Card>
      </div>

      {/* IA Insights */}
      <div style={{ marginBottom: 14, animation: 'fadeUp .75s ease' }}>
        <Card glow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <SectionTitle style={{ margin: 0 }}>Insights IA</SectionTitle>
            <Badge type="info">Claude</Badge>
          </div>
          {[
            { icon: '⚡', text: 'Volume jambes 40% sous objectif — planifie une séance cette semaine.' },
            { icon: '✦', text: 'PR développé couché +5 kg ce mois — progression solide.' },
            { icon: '◎', text: healthData?.sleep?.inBed ? `Sommeil cette nuit : ${formatSleep(healthData)} — ${healthData.sleep.inBed >= 7 ? 'récupération optimale' : 'un peu court, repose-toi ce soir'}.` : 'Recomposition en cours : −2.3 kg graisse, +1.4 kg muscle sur 6 sem.' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: i < 2 ? '0.5px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{a.icon}</span>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{a.text}</p>
            </div>
          ))}
          <button onClick={() => onNavigate('coach')} style={{
            marginTop: 12, width: '100%', padding: '9px', borderRadius: 10,
            background: 'rgba(124,111,247,0.12)', border: '0.5px solid rgba(124,111,247,0.25)',
            color: 'var(--accent2)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font)',
          }}>Parler au Coach IA →</button>
        </Card>
      </div>

      <div style={{ height: 8 }} />
    </div>
  )
}
