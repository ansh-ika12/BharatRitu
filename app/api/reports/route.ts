import { NextRequest, NextResponse } from 'next/server'
import { EVENT_TYPES, EventType } from '@/lib/constants'
import { resolveLocation } from '@/lib/geocode'
import { checkAgainstLiveWeather } from '@/lib/weatherCheck'
import { textSimilarity, DUPLICATE_SIMILARITY_THRESHOLD } from '@/lib/duplicate'
import { computeCredibility, corroborationScore, deriveStatus } from '@/lib/credibility'
import { addReport, findRecentSimilarCandidates, listReports, mergeIntoReport } from '@/lib/store'

export const dynamic = 'force-dynamic'

const DUPLICATE_WINDOW_MS = 6 * 60 * 60 * 1000 // 6 hours

export async function GET() {
  return NextResponse.json({ reports: listReports() })
}

interface ReportPayload {
  eventType?: string
  description?: string
  locality?: string
  lat?: number | null
  lng?: number | null
  contact?: string
  hasMedia?: boolean
}

export async function POST(request: NextRequest) {
  let body: ReportPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const eventType = body.eventType as EventType
  const text = (body.description ?? '').trim()
  const localityInput = (body.locality ?? '').trim()
  const lat = typeof body.lat === 'number' ? body.lat : null
  const lng = typeof body.lng === 'number' ? body.lng : null

  if (!EVENT_TYPES.some((e) => e.id === eventType)) {
    return NextResponse.json({ error: 'Please select a valid event type.' }, { status: 400 })
  }
  if (text.length < 10) {
    return NextResponse.json({ error: 'Please describe what you observed in more detail.' }, { status: 400 })
  }
  if (!localityInput && lat === null) {
    return NextResponse.json({ error: 'Please share a location, typed or via GPS.' }, { status: 400 })
  }

  const location = resolveLocation({ locality: localityInput, lat, lng })
  if (!location) {
    return NextResponse.json({ error: 'Could not determine a location for this report.' }, { status: 400 })
  }

  // Duplicate / near-duplicate detection: same event type, same district,
  // within the time window, similar wording -> treat as corroboration of
  // an existing report instead of creating a new one.
  const candidates = findRecentSimilarCandidates(eventType, location.district, DUPLICATE_WINDOW_MS)
  const duplicate = candidates
    .map((c) => ({ c, similarity: textSimilarity(c.text, text) }))
    .filter((x) => x.similarity >= DUPLICATE_SIMILARITY_THRESHOLD)
    .sort((a, b) => b.similarity - a.similarity)[0]

  if (duplicate) {
    const merged = mergeIntoReport(duplicate.c.id)
    return NextResponse.json({ report: merged, merged: true }, { status: 200 })
  }

  const sensorCheck =
    location.confidence >= 1
      ? await checkAgainstLiveWeather(location.lat, location.lng, eventType)
      : { score: 0.5, note: 'Location not recognised — live sensor check skipped, needs manual review.' }

  const sourceTrust = Math.min(0.5 + (body.contact ? 0.15 : 0) + (body.hasMedia ? 0.15 : 0), 0.8)
  const breakdown = {
    sourceTrust,
    sensorMatch: sensorCheck.score,
    corroboration: corroborationScore(1),
    locationConfidence: location.confidence,
  }
  const credibility = computeCredibility(breakdown)
  const status = deriveStatus(credibility)

  const report = addReport({
    eventType,
    text,
    locality: location.locality,
    district: location.district,
    state: location.state,
    lat: location.lat,
    lng: location.lng,
    source: 'Citizen report',
    credibility,
    status,
    credibilityBreakdown: breakdown,
    verificationNote: sensorCheck.note,
  })

  return NextResponse.json({ report, merged: false }, { status: 201 })
}
