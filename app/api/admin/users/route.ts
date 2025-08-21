import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  const { data, error } = await admin
    .from('bitsnips_profiles')
    .select('email, username, status, last_login, created_at')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ users: data })
}

export async function POST(req: Request) {
  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  const body = await req.json().catch(()=>({})) as { email?: string; action?: 'ban'|'unban' }
  if (!body.email || !body.action) return NextResponse.json({ error: 'email & action required' }, { status: 400 })
  const status = body.action === 'ban' ? 'banned' : 'active'
  const { error } = await admin
    .from('bitsnips_profiles')
    .update({ status })
    .eq('email', body.email)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true, email: body.email, status })
}
