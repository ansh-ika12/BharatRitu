import { findLocalityByName, nearestLocality } from './geodata'

export interface ResolvedLocation {
  locality: string
  district: string
  state: string
  lat: number
  lng: number
  /** 1 = matched a known place with confidence, 0.3 = free-text guess we couldn't place */
  confidence: number
}

/**
 * Resolves a citizen report's location to a district/state so it can be
 * plotted and filtered. Mirrors the "find location (GPS / place name)"
 * step of the pipeline using a small built-in gazetteer instead of the
 * full GeoNames / India Post dataset.
 */
export function resolveLocation(input: {
  locality: string
  lat: number | null
  lng: number | null
}): ResolvedLocation | null {
  const typed = input.locality.trim()

  if (input.lat !== null && input.lng !== null) {
    const nearest = nearestLocality(input.lat, input.lng)
    return {
      locality: typed || nearest.name,
      district: nearest.district,
      state: nearest.state,
      lat: input.lat,
      lng: input.lng,
      confidence: 1,
    }
  }

  const match = findLocalityByName(typed)
  if (match) {
    return {
      locality: typed,
      district: match.district,
      state: match.state,
      lat: match.lat,
      lng: match.lng,
      confidence: 1,
    }
  }

  if (!typed) return null

  // Unrecognised free-text location: keep the report, but flag low
  // location confidence so it doesn't get auto-verified.
  return {
    locality: typed,
    district: 'Unspecified',
    state: 'Unspecified',
    lat: 22.5,
    lng: 80,
    confidence: 0.3,
  }
}
