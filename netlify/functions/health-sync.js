exports.handler = async function(event, context) {

  const headers = {
    'Access-Control-Allow-Origin': 'https://fabulous-souffle-bcc429.netlify.app',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  try {
    const body = JSON.parse(event.body)
    const { data } = body

    if (!data?.metrics) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No metrics found' }) }
    }

    const find   = (name) => data.metrics.find(m => m.name === name)
    const latest = (metric) => metric?.data?.[0]?.qty ?? null

    const parsed = {
      date:       new Date().toISOString(),
      sleep:      latest(find('sleep_analysis')),
      weight:     latest(find('body_mass')),
      fat_pct:    latest(find('body_fat_percentage')),
      muscle_kg:  latest(find('lean_body_mass')),
      resting_hr: latest(find('resting_heart_rate')),
      calories:   latest(find('dietary_energy')),
      protein:    latest(find('dietary_protein')),
      carbs:      latest(find('dietary_carbohydrates')),
      fat:        latest(find('dietary_fat_total')),
      steps:      latest(find('step_count')),
      workouts:   data.workouts ?? [],
    }

    console.log('[FitAI] Sync received:', JSON.stringify(parsed))

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, parsed }) }

  } catch (err) {
    console.error('[FitAI] Sync error:', err)
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) }
  }
}
