import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const email = await getSession()
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

  const [{ data: profile }, { data: wallet }, { data: friends }, { data: leaderboard2 }] = await Promise.all([
    admin.from('bitsnips_profiles').select('*').eq('email', email).maybeSingle(),
    admin.from('bitsnips_wallets').select('*').eq('email', email).maybeSingle(),
    admin.from('bitsnips_friendships').select('friend_email, created_at').eq('user_email', email),
    admin.from('bitsnips_leaderboard2').select('*').order('total_usd', { ascending: false }).limit(10),
  ])

  // Simple global stats (can be expanded later)
  const { data: totals } = await admin
    .from('bitsnips_winnings')
    .select('usd_cents, sol_lamports', { head: false })

  const global_usd = (totals || []).reduce((a: number, r: any) => a + Number(r.usd_cents || 0), 0) / 100
  const global_sol = (totals || []).reduce((a: number, r: any) => a + Number(r.sol_lamports || 0), 0) / 1_000_000_000

  return NextResponse.json({
    email,
    profile: profile || null,
    wallet: wallet || { email, usd_cents: 0, sol_lamports: 0 },
    friends: friends || [],
    leaderboard: leaderboard2 || [],
    stats: { global_usd, global_sol },
  })
}
