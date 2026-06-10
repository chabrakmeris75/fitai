import { useState } from 'react'
import { Card, Badge, SectionTitle, ScoreRing, ProgressBar } from '../components/UI.jsx'
import { WEEKLY_PLAN } from '../data/mockData.js'

const TYPE_COLORS = {
  Push:  { bg: 'rgba(124,111,247,0.12)', border: 'rgba(124,111,247,0.25)', color: 'var(--accent2)' },
  Pull:  { bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)',  color: 'var(--blue)' },
  Legs:  { bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.25)',  color: 'var(--green)' },
  Repos: { bg: 'rgba(255,255,255,0.04)', border: 'var(--border)',          color: 'var(--text3)' },
}

const TYPE_ICONS = { Push: '⬆', Pull: '⬇', Legs: '⬡', Repos: '◌' }

const PROGRAMS = [
  { id: 'ppl', name: 'Push Pull Legs', weeks: 12, sessionsPerWeek: 6, level: 'Intermédiaire', desc: 'Programme de référence pour la prise de masse et la recomposition. Chaque groupe musculaire 2x/semaine.' },
  { id: 'upper', name: 'Upper / Lower', weeks: 8, sessionsPerWeek: 4, level: 'Débutant+', desc: 'Split haut / bas du corps. Idéal pour optimiser la récupération avec 4 séances par semaine.' },
  { id: 'fullbody', name: 'Full Body', weeks: 8, sessionsPerWeek: 3, level: 'Débutant', desc: 'Entraînement corps entier 3x/semaine. Parfait pour débuter ou en période de décharge.' },
]

export default function Program({ onNavigate }) {
  const [view, setView] = useState('week')
  const [expanded, setExpanded] = useState('Vendredi')

  const doneCount = WEEKLY_PLAN.filter(d => d.done && !d.rest).length
  const totalSessions = WEEKLY_PLAN.filter(d => !d.rest).length

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px 16px 8px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>Programme</h1>
        <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 10, padding: 3, gap: 2 }}>
          {[{ id: 'week', label: 'Semaine' }, { id: 'programs', label: 'Plans' }].map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{
              padding: '5px 12px', borderRadius: 8, border: 'none', fontSize: 12, fontFamily: 'var(--font)',
              background: view === t.id ? 'var(--bg2)' : 'transparent',
              color: view === t.id ? 'var(--text)' : 'var(--text2)',
              border: view === t.id ? '0.5px solid var(--border2)' : '0.5px solid transparent',
              cursor: 'pointer', transition: 'all .15s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {view === 'week' && (
        <>
          {/* Stats bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Programme', value: 'PPL' },
              { label: 'Semaine', value: 'S4 / 12' },
              { label: 'Séances', value: `${doneCount}/${totalSessions}` },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px', border: '0.5px solid var(--border)', textAlign: 'center' }}>
                <p style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>{s.label}</p>
                <p style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)' }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Progress */}
          <Card style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>Progression semaine</span>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{doneCount}/{totalSessions} séances</span>
            </div>
            <ProgressBar value={doneCount} max={totalSessions} color="var(--green)" height={6} />
          </Card>

          {/* Days */}
          {WEEKLY_PLAN.map(day => {
            const colors = TYPE_COLORS[day.type] || TYPE_COLORS.Repos
            const isExpanded = expanded === day.day
            const isToday = day.today

            return (
              <div key={day.day}
                onClick={() => !day.rest && setExpanded(isExpanded ? null : day.day)}
                style={{
                  background: isToday ? colors.bg : 'var(--bg2)',
                  border: `${isToday ? '1.5px' : '0.5px'} solid ${isToday ? colors.border : 'var(--border)'}`,
                  borderRadius: 14, padding: '12px 14px', marginBottom: 8,
                  cursor: day.rest ? 'default' : 'pointer',
                  opacity: day.rest && !isToday ? .55 : 1,
                  transition: 'all .15s',
                  boxShadow: isToday ? `0 0 20px ${colors.bg}` : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: colors.bg, border: `0.5px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {TYPE_ICONS[day.type]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{day.day}</span>
                      {isToday && <Badge type="info">Aujourd'hui</Badge>}
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text2)' }}>{day.type}</span>
                    {day.exercises && !isExpanded && (
                      <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>
                        {day.exercises.slice(0, 3).join(' · ')}{day.exercises.length > 3 ? ` +${day.exercises.length - 3}` : ''}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {day.done && !day.rest && <span style={{ color: 'var(--green)', fontSize: 16 }}>✓</span>}
                    {!day.rest && <span style={{ color: 'var(--text3)', fontSize: 14 }}>{isExpanded ? '▲' : '▼'}</span>}
                  </div>
                </div>

                {/* Expanded exercises */}
                {isExpanded && day.exercises && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `0.5px solid ${colors.border}` }}>
                    <p style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Exercices</p>
                    {day.exercises.map((ex, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < day.exercises.length - 1 ? `0.5px solid ${colors.border}` : 'none' }}>
                        <span style={{ fontSize: 12, color: colors.color }}>◈</span>
                        <span style={{ fontSize: 12 }}>{ex}</span>
                      </div>
                    ))}
                    {isToday && (
                      <button
                        onClick={e => { e.stopPropagation(); onNavigate('workout') }}
                        style={{
                          marginTop: 12, width: '100%', padding: '10px', borderRadius: 10,
                          background: colors.bg, border: `0.5px solid ${colors.border}`,
                          color: colors.color, fontSize: 13, fontWeight: 500,
                          cursor: 'pointer', fontFamily: 'var(--font)',
                        }}
                      >▶ Démarrer cette séance →</button>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* IA note */}
          <Card glow style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 18 }}>◎</span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Note du Coach IA</p>
                <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                  Récupération 81/100. Séance Legs recommandée ce soir — déficit de volume critique détecté.
                  Pense à logguer tes repas sur Cronometer avant la séance.
                </p>
                <button onClick={() => onNavigate('coach')} style={{
                  marginTop: 8, padding: '6px 12px', borderRadius: 8, fontSize: 12,
                  background: 'rgba(124,111,247,0.12)', border: '0.5px solid rgba(124,111,247,0.25)',
                  color: 'var(--accent2)', cursor: 'pointer', fontFamily: 'var(--font)',
                }}>Demander un ajustement →</button>
              </div>
            </div>
          </Card>
        </>
      )}

      {view === 'programs' && (
        <>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 14 }}>Choisis un programme ou demande au Coach IA d'en générer un sur mesure basé sur tes données.</p>
          {PROGRAMS.map(p => (
            <Card key={p.id} style={{ marginBottom: 10, cursor: 'pointer' }} onClick={() => onNavigate('coach')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 3 }}>{p.name}</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Badge type="neutral">{p.level}</Badge>
                    <Badge type="neutral">{p.weeks} semaines</Badge>
                    <Badge type="neutral">{p.sessionsPerWeek}j/sem</Badge>
                  </div>
                </div>
                {p.id === 'ppl' && <Badge type="ok">Actuel</Badge>}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{p.desc}</p>
            </Card>
          ))}
          <Card glow style={{ marginTop: 4 }} onClick={() => onNavigate('coach')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>◎</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Programme sur mesure IA</p>
                <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>Généré par Claude en fonction de tes données, objectifs et niveau de récupération.</p>
              </div>
            </div>
          </Card>
        </>
      )}

      <div style={{ height: 8 }} />
    </div>
  )
}
