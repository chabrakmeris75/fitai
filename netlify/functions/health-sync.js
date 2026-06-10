exports.handler = async function(event, context) {

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  // Accept both GET and POST

  }

  try {
    // Log raw body to understand Health Auto Export format
    console.log('Raw body:', event.body)

    const body = JSON.parse(event.body)
    console.log('Parsed body keys:', Object.keys(body))

    // Health Auto Export sends data in different formats
    // Try to extract metrics regardless of format
    let metrics = {}

    // Format 1: { data: { metrics: [...] } }
    if (body.data?.metrics) {
      body.data.metrics.forEach(m => {
        metrics[m.name] = m.data?.[0]?.qty ?? m.data?.[0]?.value ?? null
      })
    }
    // Format 2: { metrics: [...] }
    else if (body.metrics) {
      body.metrics.forEach(m => {
        metrics[m.name] = m.data?.[0]?.qty ?? m.data?.[0]?.value ?? null
      })
    }
    // Format 3: flat object
    else {
      metrics = body
    }

    console.log('Extracted metrics:', JSON.stringify(metrics))

    const parsed = {
      date:       new Date().toISOString(),
      sleep:      metrics['sleep_analysis'] ?? metrics['HKCategoryTypeIdentifierSleepAnalysis'] ?? null,
      weight:     metrics['body_mass'] ?? metrics['HKQuantityTypeIdentifierBodyMass'] ?? null,
      fat_pct:    metrics['body_fat_percentage'] ?? metrics['HKQuantityTypeIdentifierBodyFatPercentage'] ?? null,
      muscle_kg:  metrics['lean_body_mass'] ?? metrics['HKQuantityTypeIdentifierLeanBodyMass'] ?? null,
      resting_hr: metrics['resting_heart_rate'] ?? metrics['HKQuantityTypeIdentifierRestingHeartRate'] ?? null,
      calories:   metrics['dietary_energy'] ?? metrics['HKQuantityTypeIdentifierDietaryEnergyConsumed'] ?? null,
      protein:    metrics['dietary_protein'] ?? metrics['HKQuantityTypeIdentifierDietaryProtein'] ?? null,
      carbs:      metrics['dietary_carbohydrates'] ?? metrics['HKQuantityTypeIdentifierDietaryCarbohydrates'] ?? null,
      fat:        metrics['dietary_fat_total'] ?? metrics['HKQuantityTypeIdentifierDietaryFatTotal'] ?? null,
      steps:      metrics['step_count'] ?? metrics['HKQuantityTypeIdentifierStepCount'] ?? null,
    }

    console.log('Parsed result:', JSON.stringify(parsed))

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, parsed })
    }

  } catch (err) {
    console.error('Error:', err.message)
    console.error('Raw body was:', event.body)
    return {
      statusCode: 200, // Return 200 so Health Auto Export doesn't retry
      headers,
      body: JSON.stringify({ ok: false, error: err.message, raw: event.body })
    }
  }
}
