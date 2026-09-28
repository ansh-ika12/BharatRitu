import { NextRequest, NextResponse } from 'next/server'
import { ReportStatus, STATUS_META } from '@/lib/constants'
import { updateStatus } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest, ctx: RouteContext<'/api/reports/[id]'>) {
  const { id } = await ctx.params

  let body: { status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const status = body.status as ReportStatus
  if (!Object.keys(STATUS_META).includes(status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
  }

  const report = updateStatus(id, status)
  if (!report) {
    return NextResponse.json({ error: 'Report not found.' }, { status: 404 })
  }

  return NextResponse.json({ report })
}
