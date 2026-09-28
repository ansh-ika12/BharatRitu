'use client'

import { useState, FormEvent } from 'react'
import { MapPin, UploadCloud, Loader2, CheckCircle2 } from 'lucide-react'
import { EVENT_TYPES, STATUS_META, ReportStatus } from '@/lib/constants'
import { INDIAN_LOCALITIES } from '@/lib/geodata'

interface FormState {
  eventType: string
  description: string
  locality: string
  lat: number | null
  lng: number | null
  contact: string
  consent: boolean
  fileName: string | null
}

const initialState: FormState = {
  eventType: '',
  description: '',
  locality: '',
  lat: null,
  lng: null,
  contact: '',
  consent: false,
  fileName: null,
}

export default function ReportForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [locating, setLocating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ status: ReportStatus; credibility: number; merged: boolean } | null>(null)

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Location access is not available on this device.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude }))
        setLocating(false)
      },
      () => {
        setError('Could not access your location. Please type it in manually.')
        setLocating(false)
      }
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.eventType) return setError('Please select an event type.')
    if (form.description.trim().length < 10) return setError('Please describe what you observed in a bit more detail.')
    if (!form.locality.trim() && form.lat === null) return setError('Please share a location, typed or via GPS.')
    if (!form.consent) return setError('Please confirm consent to submit your report.')

    setSubmitting(true)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: form.eventType,
          description: form.description,
          locality: form.locality,
          lat: form.lat,
          lng: form.lng,
          contact: form.contact,
          hasMedia: form.fileName !== null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }
      setResult({ status: data.report.status, credibility: data.report.credibility, merged: data.merged })
      setSubmitted(true)
    } catch {
      setError('Could not reach the server. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-brand-brown/10 bg-white p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h2 className="mt-4 font-heading text-2xl font-bold text-brand-brown">Report submitted</h2>
        <p className="mt-2 font-body text-sm text-brand-brown/70">
          धन्यवाद! आपकी रिपोर्ट सत्यापन के लिए भेज दी गई है। · Thank you — your report is now in the verification queue and will appear on the dashboard once checked.
        </p>
        {result && (
          <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-brand-brown/10 bg-brand-cream px-4 py-1.5 text-xs font-semibold" style={{ color: STATUS_META[result.status].color }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_META[result.status].color }} />
            {result.merged ? 'Merged with an existing report' : STATUS_META[result.status].label}
            <span className="text-brand-brown/50">· {Math.round(result.credibility * 100)}% credible</span>
          </div>
        )}
        <button
          onClick={() => { setForm(initialState); setSubmitted(false); setResult(null) }}
          className="mt-6 rounded-full bg-brand-brown px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-brown/90"
        >
          Submit another report
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-brand-brown/10 bg-white p-8 md:p-10">
      <div>
        <label className="text-sm font-semibold text-brand-brown">What are you seeing? *</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {EVENT_TYPES.map((event) => (
            <button
              type="button"
              key={event.id}
              onClick={() => setForm((f) => ({ ...f, eventType: event.id }))}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${form.eventType === event.id ? 'border-transparent text-white' : 'border-brand-brown/20 text-brand-brown/70 hover:border-brand-brown/40'}`}
              style={form.eventType === event.id ? { backgroundColor: event.color } : {}}
            >
              {event.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="description" className="text-sm font-semibold text-brand-brown">What&apos;s happening? *</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={4}
          placeholder="e.g. Heavy rain since morning, water entering ground-floor shops on MG Road…"
          className="mt-2 w-full rounded-xl border border-brand-brown/20 p-3 text-sm text-brand-brown placeholder:text-brand-brown/40 focus:outline-none focus:ring-2 focus:ring-brand-brown/30"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="locality" className="text-sm font-semibold text-brand-brown">Location *</label>
          <input
            id="locality"
            type="text"
            list="locality-options"
            value={form.locality}
            onChange={(e) => setForm((f) => ({ ...f, locality: e.target.value }))}
            placeholder="Locality, city"
            className="mt-2 w-full rounded-xl border border-brand-brown/20 p-3 text-sm text-brand-brown placeholder:text-brand-brown/40 focus:outline-none focus:ring-2 focus:ring-brand-brown/30"
          />
          <datalist id="locality-options">
            {INDIAN_LOCALITIES.map((loc) => (
              <option key={loc.name} value={loc.name}>{`${loc.name}, ${loc.state}`}</option>
            ))}
          </datalist>
          <button type="button" onClick={useMyLocation} disabled={locating} className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-brown/70 hover:text-brand-brown">
            {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
            {form.lat !== null ? 'GPS location captured' : 'Use my current location'}
          </button>
        </div>

        <div>
          <label className="text-sm font-semibold text-brand-brown">Photo or video</label>
          <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-brand-brown/30 p-4 text-xs text-brand-brown/60 hover:border-brand-brown/50">
            <UploadCloud className="h-4 w-4" />
            {form.fileName ?? 'JPG, PNG or MP4, up to 25MB'}
            <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => setForm((f) => ({ ...f, fileName: e.target.files?.[0]?.name ?? null }))} />
          </label>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="contact" className="text-sm font-semibold text-brand-brown">
          Phone or email <span className="font-normal text-brand-brown/50">(to verify your report)</span>
        </label>
        <input
          id="contact"
          type="text"
          value={form.contact}
          onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
          placeholder="+91… or you@example.com"
          className="mt-2 w-full max-w-sm rounded-xl border border-brand-brown/20 p-3 text-sm text-brand-brown placeholder:text-brand-brown/40 focus:outline-none focus:ring-2 focus:ring-brand-brown/30"
        />
      </div>

      <label className="mt-6 flex items-start gap-3 text-xs text-brand-brown/70">
        <input type="checkbox" checked={form.consent} onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))} className="mt-0.5 h-4 w-4 rounded accent-brand-brown" />
        <span>
          I consent to Bharat Ritu collecting this report and location for weather verification, in line with the Digital Personal Data Protection Act, 2023. Only a locality-level location is ever shown publicly.
        </span>
      </label>

      {error && <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-brand-brown px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-brown/90 disabled:opacity-60 md:w-auto"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? 'Submitting…' : 'Submit Report'}
      </button>
    </form>
  )
}