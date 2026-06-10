import { useState, useEffect } from 'react'

const NETLIFY_URL = 'https://fitairamyv1.netlify.app/.netlify/functions/health-sync'
const STORAGE_KEY = 'fitai_health_data'

function loadCached() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveCache(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

export function useHealthData() {
  const [data, setData] = useState(loadCached)
  const [loading, setLoading] = useState(false)
  const [lastSync, setLastSync] = useState(null)
  const [error, setError] = useState(null)

  async function fetchLatest() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(NETLIFY_URL)
      const json = await res.json()
      if (json?.parsed) {
        setData(json.parsed)
        saveCache(json.parsed)
        setLastSync(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
      }
    } catch (err) {
      setError('Sync impossible — données en cache affichées')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLatest() }, [])

  return { data, loading, lastSync, error, refresh: fetchLatest }
}

export function formatSleep(data) {
  if (!data?.sleep?.inBed) return null
  const h = Math.floor(data.sleep.inBed)
  const m = Math.round((data.sleep.inBed - h) * 60)
  return `${h}h${m > 0 ? m + 'min' : ''}`
}

export function calcFormeScore(data) {
  if (!data) return 81
  let score = 65
  if (data.sleep?.inBed >= 7.5) score += 15
  else if (data.sleep?.inBed >= 6.5) score += 8
  if (data.resting_hr && data.resting_hr < 65) score += 10
  else if (data.resting_hr && data.resting_hr < 75) score += 5
  if (data.steps && data.steps > 8000) score += 5
  if (data.weight && data.weight < 85) score += 5
  return Math.min(100, score)
}
