// Simple in-memory store (resets on cold start — use Netlify Blobs for persistence)
let lastData = null

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }

  // GET — return last received data
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, parsed: lastData })
    }
  }

  // POST — receive from Health Auto Export
  try {
    const body = JSON.parse(event.body || '{}')
    const metrics = body?.data?.metrics || []

    const find = (name) => metrics.find(m => m.name === name)

    const sleepMetric = find('sleep_analysis')
    const sleepToday = sleepMetric?.data?.[sleepMetric.data.length - 1]

    const stepMetric = find('step_count')
    const steps = stepMetric?.data?.reduce((sum, d) => sum + (d.qty || 0), 0) ?? null

    const hrMetric = find('resting_heart_rate') || find('heart_rate')
    const resting_hr = hrMetric?.data?.[0]?.qty ?? null

    const weightMetric = find('body_mass')
    const weight = weightMetric?.data?.[0]?.qty ?? null

    const calMetric = find('dietary_energy')
    const calories = calMetric?.data?.[0]?.qty ?? null

    const protMetric = find('dietary_protein')
    const protein = protMetric?.data?.[0]?.qty ?? null

    lastData = {
      date: new Date().toISOString(),
      sleep: {
        inBed: sleepToday?.inBed ?? null,
        deep: sleepToday?.deep ?? null,
        rem: sleepToday?.rem ?? null,
        core: sleepToday?.core ?? null,
      },
      steps: steps ? Math.round(steps) : null,
      resting_hr: resting_hr ? Math.round(resting_hr) : null,
      weight: weight ?? null,
      calories: calories ? Math.round(calories) : null,
      protein: protein ? Math.round(protein) : null,
    }

    console.log('FitAI sync received:', JSON.stringify(lastData))

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, parsed: lastData })
    }

  } catch (err) {
    console.error('Error:', err.message)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, error: err.message })
    }
  }
}
