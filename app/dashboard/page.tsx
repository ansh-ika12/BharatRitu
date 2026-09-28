'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FiltersBar, { FiltersState, DatePreset } from '@/components/dashboard/FiltersBar'
import StatsBar from '@/components/dashboard/StatsBar'
import LiveFeed from '@/components/dashboard/LiveFeed'
import ChartsSection from '@/components/dashboard/ChartsSection'
import { Report } from '@/lib/mockReports'

const POLL_INTERVAL_MS = 20_000

const MapView = dynamic(() => import('@/components/dashboard/MapView'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center rounded-2xl bg-brand-cream text-sm text-brand-brown/50">Loading map…</div>,
})

const DATE_PRESET_MINUTES: Record<DatePreset, number> = {
  last_hour: 60,
  today: 60 * 24,
  '7d': 60 * 24 * 7,
  '30d': 60 * 24 * 30,
}

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

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

  const states = useMemo(() => Array.from(new Set(reports.map((r) => r.state))).sort(), [reports])

  const [filters, setFilters] = useState<FiltersState>({
    datePreset: '7d',
    eventTypes: [],
    statuses: ['verified'],
    state: 'all',
    search: '',
  })

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (r.minutesAgo > DATE_PRESET_MINUTES[filters.datePreset]) return false
      if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(r.eventType)) return false
      if (filters.statuses.length > 0 && !filters.statuses.includes(r.status)) return false
      if (filters.state !== 'all' && r.state !== filters.state) return false
      if (filters.search.trim() && !`${r.locality} ${r.district} ${r.state} ${r.text}`.toLowerCase().includes(filters.search.trim().toLowerCase())) return false
      return true
    })
  }, [filters, reports])

  return (
    <main className="min-h-screen bg-brand-clay">
      <Navbar variant="solid" />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-body text-sm uppercase tracking-widest text-brand-brown/50">लाइव डैशबोर्ड · Live Dashboard</p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-brand-brown md:text-4xl">What India is reporting, right now</h1>
          </div>
          {loading && <p className="pb-1 text-xs font-medium text-brand-brown/40">Loading live reports…</p>}
        </div>

        <div className="space-y-6">
          <FiltersBar filters={filters} onChange={setFilters} states={states} />
          <StatsBar reports={filteredReports} totalBeforeFilters={reports.length} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="relative z-0 isolate h-[520px] lg:col-span-2">
              <MapView reports={filteredReports} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
            <div className="h-[520px]">
              <LiveFeed reports={filteredReports} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          </div>

          <ChartsSection reports={filteredReports} />
        </div>
      </div>

      <Footer />
    </main>
  )
}