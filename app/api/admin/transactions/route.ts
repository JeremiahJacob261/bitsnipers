import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function GET(req: Request) {
  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  const url = new URL(req.url)
  const type = url.searchParams.get('type')
  let query = admin.from('bitsnips_transactions')
    .select('id, created_at, user_email, type, amount_usd_cents, status, reference')
    .order('created_at', { ascending: false })
    .limit(200)
  if (type) query = query.eq('type', type)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ transactions: data })
}

export async function POST(req: Request) {
  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  const body = await req.json().catch(()=>({})) as { id?: number; action?: 'approve'|'reject' }
  if (!body.id || !body.action) return NextResponse.json({ error: 'id & action required' }, { status: 400 })
  const status = body.action === 'approve' ? 'completed' : 'rejected'
  const { error } = await admin
    .from('bitsnips_transactions')
    .update({ status })
    .eq('id', body.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true, id: body.id, status })
}
