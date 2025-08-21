import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  const { data, error } = await admin
    .from('bitsnips_games')
    .select('id, created_at, closed_at, status, buy_in_usd_cents, pot_usd_cents, rake_usd_cents, winner_email')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ games: data })
}
