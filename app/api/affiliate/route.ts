import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const email = await getSession()
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  const { data: affiliate } = await admin
    .from('bitsnips_affiliates')
    .select('*')
    .eq('owner_email', email)
    .maybeSingle()
  let referrals: any[] = []
  if (affiliate) {
    const { data: refs } = await admin
      .from('bitsnips_affiliate_referrals')
      .select('referred_email, earnings_usd_cents, earnings_sol_lamports, games_played, created_at')
      .eq('affiliate_code', affiliate.code)
    referrals = refs || []
  }
  return NextResponse.json({ affiliate, referrals })
}

export async function POST(req: Request) {
  const email = await getSession()
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  const { code } = await req.json().catch(() => ({}))
  if (!code || typeof code !== 'string' || !/^[a-z0-9_-]{3,32}$/i.test(code)) {
    return NextResponse.json({ error: 'Invalid code (3-32 alphanum/_-)' }, { status: 400 })
  }
  // Upsert affiliate; if exists for another user, error
  const { data: existing, error: existingError } = await admin
    .from('bitsnips_affiliates')
    .select('owner_email')
    .eq('code', code)
    .maybeSingle()
  if (existingError) return NextResponse.json({ error: existingError.message }, { status: 400 })
  if (existing && existing.owner_email !== email) {
    return NextResponse.json({ error: 'Code already taken' }, { status: 409 })
  }
  const upsert = {
    owner_email: email,
    code,
  }
  const { error } = await admin.from('bitsnips_affiliates').upsert(upsert, { onConflict: 'code' })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true, code })
}
