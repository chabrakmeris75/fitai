exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }

  try {
    const body = JSON.parse(event.body || '{}')
    const metrics = body?.data?.metrics || []

    const find = (name) => metrics.find(m => m.name === name)
    
    // Sleep — use summarized data
    const sleepMetric = find('sleep_analysis')
    const sleepToday = sleepMetric?.data?.[sleepMetric.data.length - 1]
    const sleep = {
      inBed: sleepToday?.inBed ?? null,
      deep: sleepToday?.deep ?? null,
      rem: sleepToday?.rem ?? null,
      core: sleepToday?.core ?? null,
      date: sleepToday?.date ?? null,
    }

    // Steps — sum all today's steps
    const stepMetric = find('step_count')
    const steps = stepMetric?.data?.reduce((sum, d) => sum + (d.qty || 0), 0) ?? null

    // Heart rate — average
    const hrMetric = find('heart_rate') || find('resting_heart_rate')
    const resting_hr = hrMetric?.data?.[0]?.qty ?? null

    // Weight
    const weightMetric = find('body_mass')
    const weight = weightMetric?.data?.[0]?.qty ?? null

    // Nutrition
    const calMetric = find('dietary_energy')
    const calories = calMetric?.data?.[0]?.qty ?? null
    const protMetric = find('dietary_protein')
    const protein = protMetric?.data?.[0]?.qty ?? null

    const parsed = {
      date: new Date().toISOString(),
      sleep,
      steps: Math.round(steps),
      resting_hr,
      weight,
      calories: Math.round(calories),
      protein: Math.round(protein),
    }

    console.log('FitAI parsed:', JSON.stringify(parsed))

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, parsed })
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
