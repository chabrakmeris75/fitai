import { useState, useEffect } from 'react'
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card, Badge, Tabs, SectionTitle, ProgressBar, Spinner } from '../components/UI.jsx'
import { SOURCES_STATUS, CORRELATIONS_30D, MUSCLE_VOLUME } from '../data/mockData.js'

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1a1a24', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 12px', fontSize: 11 }}>
      <p style={{ color: 'var(--text3)', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color, fontWeight: 500 }}>{p.name}: {p.value}</p>)}
    </div>
  )
}

function SourceCard({ src, onSync }) {
  const [syncing, setSyncing] = useState(false)
  const [pts, setPts] = useState(src.pts)

  async function doSync() {
    setSyncing(true)
    let n = pts
    const iv = setInterval(() => { n += Math.floor(Math.random() * 5) + 1; setPts(n) }, 80)
    await new Promise(r => setTimeout(r, 1800))
    clearInterval(iv)
    setSyncing(false)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '0.5px solid var(--border)' }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
        {src.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{src.name}</span>
          <Badge type="ok">✓ Connecté</Badge>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text3)' }}>{src.desc}</p>
        <p style={{ fontSize: 11, color: 'var(--green)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{pts} pts · aujourd'hui</p>
      </div>
      <button onClick={doSync} disabled={syncing} style={{
        padding: '6px 10px', borderRadius: 8, fontSize: 11, background: 'var(--bg3)',
        border: '0.5px solid var(--border)', color: 'var(--text2)', cursor: 'pointer',
        fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 5,
      }}>
        {syncing ? <Spinner /> : '⟳'}
      </button>
    </div>
  )
}

export default function Sync({ onNavigate }) {
  const [tab, setTab] = useState('sync')
  const [syncing, setSyncing] = useState(false)
  const [pts, setPts] = useState(1247)
  const [lastSync, setLastSync] = useState('02:00')

  function doFullSync() {
    setSyncing(true)
    let n = pts
    const iv = setInterval(() => { n += Math.floor(Math.random() * 8) + 2; setPts(n) }, 60)
    setTimeout(() => {
      clearInterval(iv)
      setSyncing(false)
      const now = new Date()
      setLastSync(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`)
    }, 2400)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px 16px 8px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>Sync & Insights</h1>
        <Tabs
          tabs={[{ id: 'sync', label: 'Sources' }, { id: 'correlations', label: 'Correl.' }, { id: 'volume', label: 'Volume' }]}
          active={tab}
          onChange={setTab}
          style={{ width: 190 }}
        />
      </div>

      {tab === 'sync' && (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Sources', value: '3' },
              { label: 'Dernière sync', value: lastSync },
              { label: 'Points', value: pts.toLocaleString('fr-FR') },
              { label: 'Fréquence', value: '6h' },
            ].map((m, i) => (
              <div key={i} style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px 8px', border: '0.5px solid var(--border)', textAlign: 'center' }}>
                <p style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 3, textTransform: 'uppercase' }}>{m.label}</p>
                <p style={{ fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-display)' }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Sources */}
          <Card style={{ marginBottom: 14 }}>
            <SectionTitle>Sources Apple Health</SectionTitle>
            {SOURCES_STATUS.map(src => <SourceCard key={src.id} src={src} />)}
            <div style={{ paddingTop: 4 }} />
          </Card>

          {/* Données du jour */}
          <Card style={{ marginBottom: 14 }}>
            <SectionTitle>Données disponibles aujourd'hui</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { label: 'Sommeil', value: '7h 12', src: 'Zepp', ok: true },
                { label: 'Poids', value: '80.9 kg', src: 'Renpho', ok: true },
                { label: 'Calories', value: '2 200 kcal', src: 'Cronometer', ok: true },
                { label: 'Protéines', value: '178 g', src: 'Cronometer', ok: true },
                { label: 'FC repos', value: '58 bpm', src: 'Zepp', ok: true },
                { label: 'Séance', value: 'Push 58m', src: 'Zepp', ok: true },
              ].map((d, i) => (
                <div key={i} style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px', border: '0.5px solid var(--border)' }}>
                  <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 3 }}>{d.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{d.value}</p>
                  <p style={{ fontSize: 10, color: 'var(--green)' }}>✓ {d.src}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Sync button */}
          <button onClick={doFullSync} disabled={syncing} style={{
            width: '100%', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 500,
            background: syncing ? 'var(--bg3)' : 'var(--accent)',
            border: `0.5px solid ${syncing ? 'var(--border)' : 'rgba(124,111,247,0.4)'}`,
            color: syncing ? 'var(--text2)' : '#fff', cursor: syncing ? 'default' : 'pointer',
            fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all .2s',
          }}>
            {syncing ? <><Spinner /> Synchronisation en cours…</> : '⟳ Synchroniser maintenant'}
          </button>

          {/* Install guide */}
          <Card style={{ marginTop: 14 }} glow>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📱 Installer sur iPhone</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Ouvre cette page dans Safari',
                'Appuie sur le bouton Partager ⬆',
                'Sélectionne "Sur l\'écran d\'accueil"',
                'Appuie sur "Ajouter" — c\'est tout !',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                  <p style={{ fontSize: 12, color: 'var(--text2)' }}>{step}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {tab === 'correlations' && (
        <>
          <Card style={{ marginBottom: 14 }}>
            <SectionTitle>Sommeil → Volume d'entraînement (30j)</SectionTitle>
            <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--text3)', marginBottom: 10 }}>
              <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--accent)', marginRight: 4, verticalAlign: -1 }} />Volume (kg)</span>
              <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--green)', marginRight: 4, verticalAlign: -1, opacity: .7 }} />Sommeil (h)</span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={CORRELATIONS_30D}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: 'rgba(240,240,245,.25)', fontSize: 9 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis yAxisId="left" tick={{ fill: 'rgba(240,240,245,.2)', fontSize: 9 }} axisLine={false} tickLine={false} width={32} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(240,240,245,.2)', fontSize: 9 }} axisLine={false} tickLine={false} width={24} domain={[4, 11]} />
                <Tooltip content={<TT />} />
                <Line yAxisId="left" type="monotone" dataKey="volume" name="Volume" stroke="var(--accent)" strokeWidth={1.5} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="sleep" name="Sommeil" stroke="var(--green)" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Corrélation r', value: '+0.74', color: 'var(--green)', note: 'Forte positive' },
              { label: 'Impact <6h30', value: '−18%', color: 'var(--red)', note: 'Sur le volume' },
              { label: 'Optimal', value: '7h30+', color: 'var(--text)', note: 'Perf. max' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px', border: '0.5px solid var(--border)', textAlign: 'center' }}>
                <p style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>{s.label}</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</p>
                <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{s.note}</p>
              </div>
            ))}
          </div>

          <Card style={{ marginBottom: 14 }}>
            <SectionTitle>Protéines → Récupération (30j)</SectionTitle>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={CORRELATIONS_30D}>
                <defs>
                  <linearGradient id="gProt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c6ff7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7c6ff7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRecov" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: 'rgba(240,240,245,.25)', fontSize: 9 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fill: 'rgba(240,240,245,.2)', fontSize: 9 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip content={<TT />} />
                <Area type="monotone" dataKey="protein" name="Protéines (g)" stroke="var(--accent)" strokeWidth={1.5} fill="url(#gProt)" dot={false} />
                <Area type="monotone" dataKey="recovery" name="Récup." stroke="var(--green)" strokeWidth={1.5} fill="url(#gRecov)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Insights */}
          {[
            { icon: '✦', type: 'ok', text: 'Quand tu dors >7h30, ton volume d\'entraînement est +18% supérieur le lendemain.' },
            { icon: '⚡', type: 'warn', text: 'Protéines basses les jours de repos (142g vs 200g objectif) — récupération réduite de 15%.' },
            { icon: '◎', type: 'info', text: 'Recomposition confirmée sur 6 semaines : −2.3 kg graisse, +1.4 kg muscle.' },
          ].map((a, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 8,
              background: a.type === 'ok' ? 'rgba(52,211,153,0.07)' : a.type === 'warn' ? 'rgba(251,191,36,0.07)' : 'rgba(124,111,247,0.08)',
              border: `0.5px solid ${a.type === 'ok' ? 'rgba(52,211,153,0.2)' : a.type === 'warn' ? 'rgba(251,191,36,0.2)' : 'rgba(124,111,247,0.2)'}`,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{a.icon}</span>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{a.text}</p>
            </div>
          ))}

          <button onClick={() => onNavigate('coach')} style={{
            width: '100%', padding: '11px', borderRadius: 12, marginTop: 4, fontSize: 13, fontWeight: 500,
            background: 'rgba(124,111,247,0.12)', border: '0.5px solid rgba(124,111,247,0.25)',
            color: 'var(--accent2)', cursor: 'pointer', fontFamily: 'var(--font)',
          }}>Analyser avec le Coach IA →</button>
        </>
      )}

      {tab === 'volume' && (
        <>
          <Card style={{ marginBottom: 14 }}>
            <SectionTitle>Volume par groupe musculaire</SectionTitle>
            <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>Semaine en cours vs objectif minimum</p>
            {MUSCLE_VOLUME.map(m => {
              const pct = Math.round(Math.min(100, (m.sets / m.target) * 100))
              const color = pct >= 100 ? 'var(--green)' : pct >= 70 ? 'var(--amber)' : 'var(--red)'
              return (
                <div key={m.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                    <span style={{ color: 'var(--text2)' }}>{m.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color, fontFamily: 'var(--font-mono)', fontSize: 11 }}>{pct}%</span>
                      <span style={{ color: 'var(--text3)', fontSize: 11 }}>{m.sets}/{m.target} séries</span>
                    </div>
                  </div>
                  <ProgressBar value={m.sets} max={m.target} color={color} height={6} />
                </div>
              )
            })}
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Volume total', value: '107', unit: 'séries', note: 'vs 114 objectif', color: 'var(--text)' },
              { label: 'Groupe en retard', value: 'Jambes', unit: '', note: '50% du volume', color: 'var(--red)' },
              { label: 'Groupe en surplus', value: 'Dos', unit: '', note: '110% — ok', color: 'var(--green)' },
              { label: 'Décharge dans', value: '2', unit: 'semaines', note: 'planifiée S6', color: 'var(--amber)' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--bg3)', borderRadius: 10, padding: '12px', border: '0.5px solid var(--border)' }}>
                <p style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: 'var(--font-display)' }}>{s.value} <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text3)' }}>{s.unit}</span></p>
                <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{s.note}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ height: 8 }} />
    </div>
  )
}
