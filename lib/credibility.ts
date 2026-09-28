import { ReportStatus } from './constants'

export interface CredibilityBreakdown {
  sourceTrust: number
  sensorMatch: number
  corroboration: number
  locationConfidence: number
}

const WEIGHTS = {
  sourceTrust: 0.3,
  sensorMatch: 0.4,
  corroboration: 0.2,
  locationConfidence: 0.1,
}

export function computeCredibility(breakdown: CredibilityBreakdown): number {
  const score =
    breakdown.sourceTrust * WEIGHTS.sourceTrust +
    breakdown.sensorMatch * WEIGHTS.sensorMatch +
    breakdown.corroboration * WEIGHTS.corroboration +
    breakdown.locationConfidence * WEIGHTS.locationConfidence
  return Math.max(0, Math.min(1, score))
}

export function deriveStatus(score: number): ReportStatus {
  if (score >= 0.75) return 'verified'
  if (score >= 0.4) return 'under_review'
  return 'flagged'
}

export function corroborationScore(independentAuthorCount: number): number {
  return Math.min(independentAuthorCount / 8, 1)
}
