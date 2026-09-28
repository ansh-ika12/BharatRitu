'use client'

import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Report } from '@/lib/mockReports'
import { EVENT_TYPES, STATUS_META, ReportStatus } from '@/lib/constants'
import { CheckCircle2, XCircle, ShieldQuestion } from 'lucide-react'

const POLL_INTERVAL_MS = 15_000

const BREAKDOWN_LABELS: Record<string, string> = {
  sourceTrust: 'Source trust',
  sensorMatch: 'Live sensor match',
  corroboration: 'Corroboration',
  locationConfidence: 'Location confidence',
}

function timeAgo(minutes: number) {
  if (minutes < 60) return `${minutes}m ago`
  return `${Math.floor(minutes / 60)}h ago`
}

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/reports')
        const data = await res.json()
        if (!cancelled) setReports(data.reports ?? [])
      } catch {
        // keep last known reports on a failed poll
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, POLL_INTERVAL_MS)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  const queue = useMemo(
    () => reports.filter((r) => r.status !== 'verified').sort((a, b) => a.minutesAgo - b.minutesAgo),
    [reports]
  )
  const recent = useMemo(
    () => reports.filter((r) => r.status === 'verified').sort((a, b) => a.minutesAgo - b.minutesAgo).slice(0, 8),
    [reports]
  )

  const setStatus = async (id: string, status: ReportStatus) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (res.ok) {
        setReports((prev) => prev.map((r) => (r.id === id ? data.report : r)))
      }
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-brand-clay">
      <Navbar variant="solid" />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-body text-sm uppercase tracking-widest text-brand-brown/50">एडमिन पैनल · Admin Panel</p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-brand-brown md:text-4xl">Review queue</h1>
            <p className="mt-2 max-w-xl font-body text-sm text-brand-brown/70">
              Reports the pipeline couldn&apos;t confidently verify on its own. Each score is broken down by source
              trust, live sensor match, corroboration and location confidence — decide, and the report updates on
              the public dashboard immediately.
            </p>
          </div>
          {loading && <p className="pb-1 text-xs font-medium text-brand-brown/40">Loading…</p>}
        </div>

        <div className="space-y-4">
          {queue.length === 0 && !loading && (
            <div className="rounded-2xl border border-brand-brown/10 bg-white p-8 text-center text-sm text-brand-brown/60">
              Nothing needs review right now — the queue is clear.
            </div>
          )}

          {queue.map((report) => {
            const event = EVENT_TYPES.find((e) => e.id === report.eventType)!
            const status = STATUS_META[report.status]
            return (
              <div key={report.id} className="rounded-2xl border border-brand-brown/10 bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white" style={{ backgroundColor: event.color }}>
                      {event.label}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: status.color }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.color }} />
                      {status.label} · {Math.round(report.credibility * 100)}%
                    </span>
                  </div>
                  <span className="text-xs text-brand-brown/50">{timeAgo(report.minutesAgo)} · {report.source}</span>
                </div>

                <p className="mt-3 text-sm text-brand-brown/90">{report.text}</p>
                <p className="mt-1 text-xs text-brand-brown/50">{report.locality}, {report.district}, {report.state}</p>

                {report.credibilityBreakdown && (
                  <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
                    {Object.entries(report.credibilityBreakdown).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-[11px] text-brand-brown/60">
                          <span>{BREAKDOWN_LABELS[key] ?? key}</span>
                          <span>{Math.round((value as number) * 100)}%</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-brand-cream">
                          <div className="h-1.5 rounded-full bg-brand-brown" style={{ width: `${(value as number) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {report.verificationNote && (
                  <p className="mt-3 flex items-start gap-1.5 text-xs text-brand-brown/60">
                    <ShieldQuestion className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {report.verificationNote}
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setStatus(report.id, 'verified')}
                    disabled={updatingId === report.id}
                    className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verify
                  </button>
                  <button
                    onClick={() => setStatus(report.id, 'flagged')}
                    disabled={updatingId === report.id}
                    className="flex items-center gap-1.5 rounded-full bg-rose-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Flag as fake
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {recent.length > 0 && (
          <div className="mt-10">
            <h2 className="font-heading text-lg font-bold text-brand-brown">Recently verified</h2>
            <div className="mt-3 space-y-2">
              {recent.map((report) => (
                <div key={report.id} className="flex items-center justify-between rounded-xl border border-brand-brown/10 bg-white px-4 py-2.5 text-sm">
                  <span className="text-brand-brown/80">{report.locality}, {report.district} · {report.text.slice(0, 60)}{report.text.length > 60 ? '…' : ''}</span>
                  <span className="shrink-0 text-xs font-semibold text-emerald-600">{Math.round(report.credibility * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
