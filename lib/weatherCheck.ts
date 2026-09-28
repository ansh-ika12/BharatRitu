import { EventType } from './constants'

export interface SensorCheckResult {
  score: number // 0-1, how well live conditions support the claimed event
  note: string
}

interface OpenMeteoCurrent {
  temperature_2m?: number
  precipitation?: number
  weather_code?: number
  wind_speed_10m?: number
}

const THUNDER_CODES = new Set([95, 96, 99])
const FOG_CODES = new Set([45, 48])
const RAIN_CODES = new Set([51, 53, 55, 61, 63, 65, 80, 81, 82])

function scoreForEvent(eventType: EventType, current: OpenMeteoCurrent): SensorCheckResult {
  const precip = current.precipitation ?? 0
  const temp = current.temperature_2m ?? null
  const wind = current.wind_speed_10m ?? 0
  const code = current.weather_code ?? -1

  switch (eventType) {
    case 'rainfall':
    case 'flood': {
      if (precip > 2 || RAIN_CODES.has(code)) return { score: 1, note: `Live reading shows ${precip}mm precipitation, matches claim` }
      if (precip > 0) return { score: 0.7, note: `Light precipitation (${precip}mm) recorded nearby` }
      return { score: 0.25, note: 'No precipitation recorded at this location right now' }
    }
    case 'thunderstorm': {
      if (THUNDER_CODES.has(code)) return { score: 1, note: 'Live weather code confirms thunderstorm activity' }
      if (precip > 0) return { score: 0.55, note: 'Precipitation present but no thunderstorm code recorded' }
      return { score: 0.2, note: 'No thunderstorm signal in live conditions' }
    }
    case 'heatwave': {
      if (temp === null) return { score: 0.5, note: 'Temperature reading unavailable' }
      if (temp >= 40) return { score: 1, note: `Live temperature ${temp}°C confirms heatwave conditions` }
      if (temp >= 35) return { score: 0.6, note: `Live temperature ${temp}°C is elevated but below heatwave threshold` }
      return { score: 0.2, note: `Live temperature only ${temp}°C, does not support the claim` }
    }
    case 'fog': {
      if (FOG_CODES.has(code)) return { score: 1, note: 'Live weather code confirms fog' }
      return { score: 0.3, note: 'No fog signal in live weather code' }
    }
    case 'dust_storm': {
      if (wind >= 30) return { score: 0.75, note: `Strong winds (${wind} km/h) are consistent with dust storm reports` }
      return { score: 0.35, note: 'Wind speed does not strongly support a dust storm claim' }
    }
    case 'strong_wind': {
      if (wind >= 30) return { score: 1, note: `Live wind speed ${wind} km/h confirms strong wind` }
      if (wind >= 18) return { score: 0.6, note: `Wind speed ${wind} km/h is moderate` }
      return { score: 0.2, note: `Live wind speed only ${wind} km/h` }
    }
    default:
      return { score: 0.5, note: 'No sensor rule for this event type' }
  }
}

/**
 * Cross-checks a claimed event type against a live public weather reading
 * for the report's location, standing in for the IMD / Open-Meteo
 * verification step of the pipeline.
 */
export async function checkAgainstLiveWeather(
  lat: number,
  lng: number,
  eventType: EventType
): Promise<SensorCheckResult> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)
    if (!res.ok) return { score: 0.5, note: 'Live weather service unavailable, sensor check skipped' }
    const data = (await res.json()) as { current?: OpenMeteoCurrent }
    if (!data.current) return { score: 0.5, note: 'Live weather data missing, sensor check skipped' }
    return scoreForEvent(eventType, data.current)
  } catch {
    return { score: 0.5, note: 'Could not reach live weather service, sensor check skipped' }
  }
}
