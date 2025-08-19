import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const { username } = await req.json().catch(() => ({}))
  if (!username || typeof username !== 'string' || username.length < 3) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 })
  }
  const email = await getSession()
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

  const { error } = await admin
    .from('bitsnips_profiles')
    .upsert({ email, username, display_name: username }, { onConflict: 'email' })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true, username })
}
