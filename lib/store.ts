import fs from 'fs'
import path from 'path'
import { EventType, ReportStatus } from './constants'
import { MOCK_REPORTS, Report } from './mockReports'
import { CredibilityBreakdown } from './credibility'

interface StoredReport extends Omit<Report, 'minutesAgo'> {
  createdAt: number // epoch ms
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'reports.json')

function seed(): StoredReport[] {
  const now = Date.now()
  return MOCK_REPORTS.map(({ minutesAgo, ...rest }) => ({
    ...rest,
    createdAt: now - minutesAgo * 60_000,
  }))
}

function load(): StoredReport[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    const parsed = JSON.parse(raw) as StoredReport[]
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch {
    // no file yet, or unreadable — fall back to seed data
  }
  return seed()
}

function persist(reports: StoredReport[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2), 'utf-8')
  } catch {
    // Best-effort persistence only (e.g. read-only filesystems in some
    // deployments); the in-memory store below remains the source of
    // truth for the running process either way.
  }
}

// Module-level singleton so all API route invocations in this process
// share the same in-memory report list, backed by a JSON file for
// persistence across dev-server restarts. A production build of
// WeatherPulse replaces this with PostgreSQL + PostGIS.
const globalForStore = globalThis as unknown as { __weatherpulseReports?: StoredReport[] }
if (!globalForStore.__weatherpulseReports) {
  globalForStore.__weatherpulseReports = load()
}
const reports = globalForStore.__weatherpulseReports

function toReport(r: StoredReport): Report {
  const minutesAgo = Math.max(0, Math.round((Date.now() - r.createdAt) / 60_000))
  return {
    id: r.id,
    eventType: r.eventType,
    status: r.status,
    credibility: r.credibility,
    locality: r.locality,
    district: r.district,
    state: r.state,
    lat: r.lat,
    lng: r.lng,
    source: r.source,
    reportCount: r.reportCount,
    authorCount: r.authorCount,
    text: r.text,
    credibilityBreakdown: r.credibilityBreakdown,
    verificationNote: r.verificationNote,
    minutesAgo,
  }
}

export function listReports(): Report[] {
  return [...reports].sort((a, b) => b.createdAt - a.createdAt).map(toReport)
}

export function findRecentSimilarCandidates(eventType: EventType, district: string, windowMs: number): Report[] {
  const cutoff = Date.now() - windowMs
  return reports
    .filter((r) => r.eventType === eventType && r.district === district && r.createdAt >= cutoff)
    .map(toReport)
}

export interface NewReportInput {
  eventType: EventType
  text: string
  locality: string
  district: string
  state: string
  lat: number
  lng: number
  source: string
  credibility: number
  status: ReportStatus
  credibilityBreakdown: CredibilityBreakdown
  verificationNote: string
}

export function addReport(input: NewReportInput): Report {
  const stored: StoredReport = {
    id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    eventType: input.eventType,
    status: input.status,
    credibility: input.credibility,
    locality: input.locality,
    district: input.district,
    state: input.state,
    lat: input.lat,
    lng: input.lng,
    source: input.source,
    reportCount: 1,
    authorCount: 1,
    text: input.text,
    credibilityBreakdown: input.credibilityBreakdown,
    verificationNote: input.verificationNote,
    createdAt: Date.now(),
  }
  reports.push(stored)
  persist(reports)
  return toReport(stored)
}

export function mergeIntoReport(id: string): Report | null {
  const existing = reports.find((r) => r.id === id)
  if (!existing) return null
  existing.reportCount += 1
  existing.authorCount += 1
  persist(reports)
  return toReport(existing)
}

export function updateStatus(id: string, status: ReportStatus): Report | null {
  const existing = reports.find((r) => r.id === id)
  if (!existing) return null
  existing.status = status
  if (status === 'verified') existing.credibility = Math.max(existing.credibility, 0.85)
  if (status === 'flagged') existing.credibility = Math.min(existing.credibility, 0.15)
  persist(reports)
  return toReport(existing)
}
