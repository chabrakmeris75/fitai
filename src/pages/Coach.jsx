import { useState, useRef, useEffect } from 'react'
import { Card, Spinner, Badge } from '../components/UI.jsx'
import { SLEEP_DATA, WEIGHT_DATA, TODAY_NUTRITION, WORKOUTS, MUSCLE_VOLUME } from '../data/mockData.js'

const SYSTEM_PROMPT = `Tu es un coach sportif et nutritionniste expert, intégré à l'app FitAI.
Tu as accès aux données réelles de l'utilisateur. Réponds toujours en français, de façon concise et actionnable (max 150 mots).
Utilise des bullet points quand c'est plus lisible. Sois direct, positif et précis.

DONNÉES ACTUELLES DE L'UTILISATEUR :
- Poids : 80.9 kg (objectif : 78 kg)
- Masse musculaire : 42.5 kg (+1.4 kg en 6 semaines)
- % graisse : 16.9% (-1.5% en 6 semaines)
- Sommeil moyen cette semaine : 7.1h (objectif : 7.5h)
- Calories aujourd'hui : 2 200 kcal (objectif : 2 400 kcal)
- Protéines aujourd'hui : 178g (objectif : 200g)
- Glucides : 242g / 280g, Lipides : 68g / 75g
- Score de forme : 81/100
- Dernière séance : Push (Poitrine & Épaules) — 58 min — 8 240 kg de volume — PR développé couché 102.5 kg
- Volume jambes cette semaine : 10 séries vs objectif 20 (déficit critique)
- Recomposition en cours depuis 6 semaines — ratio favorable

Réponds à la question de l'utilisateur en te basant sur ces données.`

const QUICK_PROMPTS = [
  { label: 'Pourquoi moins de force ?', q: 'Pourquoi est-ce que j\'ai moins de force aujourd\'hui ?' },
  { label: 'Macros optimales ?', q: 'Est-ce que mes macros sont optimales pour ma recomposition ?' },
  { label: 'Surentraînement ?', q: 'Est-ce que je suis en surentraînement en ce moment ?' },
  { label: 'Bilan semaine', q: 'Fais-moi un bilan complet de ma semaine et donne-moi 3 priorités pour la semaine prochaine.' },
  { label: 'Plan Legs', q: 'Je dois rattraper mon déficit de volume jambes. Crée-moi une séance Legs complète pour ce soir.' },
  { label: 'Sommeil & perf.', q: 'Explique-moi l\'impact de mon sommeil sur mes performances cette semaine.' },
]

function formatText(text) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('• ') || line.startsWith('- ')) {
      return <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 3 }}><span style={{ color: 'var(--accent2)', flexShrink: 0 }}>·</span><span>{line.slice(2)}</span></div>
    }
    if (line.match(/^\*\*(.+)\*\*/)) {
      return <p key={i} style={{ fontWeight: 600, marginBottom: 3 }}>{line.replace(/\*\*/g, '')}</p>
    }
    if (!line.trim()) return <div key={i} style={{ height: 6 }} />
    return <p key={i} style={{ marginBottom: 3 }}>{line}</p>
  })
}

export default function Coach() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis ton coach IA. J\'ai accès à toutes tes données — sommeil, nutrition, entraînements, composition corporelle.\n\nScore de forme actuel : 81/100. Que veux-tu savoir ?',
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text) {
    const q = (text || input).trim()
    if (!q || loading) return
    setInput('')

    const newMessages = [...messages, { role: 'user', content: q }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      })

      const data = await res.json()
      const reply = data.content?.[0]?.text || 'Désolé, je n\'ai pas pu générer une réponse.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Erreur de connexion. Vérifie ta connexion internet et réessaie.',
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '16px 16px 10px', borderBottom: '0.5px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(124,111,247,0.2)', border: '0.5px solid rgba(124,111,247,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>◎</div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700 }}>Coach IA</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>En ligne · Accès à tes données</span>
            </div>
          </div>
          <Badge type="info" style={{ marginLeft: 'auto' }}>Claude</Badge>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(124,111,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, marginRight: 8, marginTop: 2 }}>◎</div>
            )}
            <div style={{
              maxWidth: '78%',
              padding: '10px 13px',
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: m.role === 'user' ? 'var(--accent)' : 'var(--bg3)',
              border: `0.5px solid ${m.role === 'user' ? 'rgba(124,111,247,0.4)' : 'var(--border)'}`,
              fontSize: 13,
              lineHeight: 1.55,
              animation: 'fadeUp .2s ease',
            }}>
              {m.role === 'assistant' ? formatText(m.content) : <p>{m.content}</p>}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(124,111,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>◎</div>
            <div style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: '16px 16px 16px 4px', padding: '10px 14px', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent2)', display: 'inline-block', animation: `pulse 1.2s ease ${i * .2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div style={{ padding: '8px 12px 4px', borderTop: '0.5px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {QUICK_PROMPTS.map(p => (
            <button key={p.label} onClick={() => send(p.q)} disabled={loading} style={{
              padding: '5px 11px', borderRadius: 20, fontSize: 11, whiteSpace: 'nowrap',
              background: 'var(--bg3)', border: '0.5px solid var(--border)',
              color: 'var(--text2)', cursor: 'pointer', fontFamily: 'var(--font)',
              flexShrink: 0, opacity: loading ? .5 : 1,
            }}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: '8px 12px', paddingBottom: 'max(8px, env(safe-area-inset-bottom))', display: 'flex', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Pose ta question…"
          style={{
            flex: 1, background: 'var(--bg3)', border: '0.5px solid var(--border2)',
            borderRadius: 12, padding: '10px 14px', fontSize: 13, outline: 'none',
            resize: 'none', fontFamily: 'var(--font)',
          }}
        />
        <button onClick={() => send()} disabled={!input.trim() || loading} style={{
          width: 40, height: 40, borderRadius: '50%', background: input.trim() && !loading ? 'var(--accent)' : 'var(--bg3)',
          border: '0.5px solid var(--border)', cursor: input.trim() && !loading ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transition: 'background .2s', fontSize: 16,
        }}>
          {loading ? <Spinner /> : <span style={{ color: input.trim() ? '#fff' : 'var(--text3)' }}>↑</span>}
        </button>
      </div>
    </div>
  )
}
