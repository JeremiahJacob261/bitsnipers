import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

  const [usersCount, activeUsers, totalBalance, todayGames, revenue] = await Promise.all([
    admin.from('bitsnips_profiles').select('id', { count: 'exact', head: true }),
    admin.from('bitsnips_profiles').select('id', { count: 'exact', head: true }).eq('status','active'),
    admin.rpc('bitsnips_total_balance').then(r => ({ data: r.data, error: r.error })),
    admin.from('bitsnips_games').select('id', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().slice(0,10)),
    admin.rpc('bitsnips_revenue_today').then(r => ({ data: r.data, error: r.error })),
  ])

  return NextResponse.json({
    users: usersCount.count || 0,
    activeUsers: activeUsers.count || 0,
    totalBalanceUsd: (totalBalance.data || 0)/100,
    todayGames: todayGames.count || 0,
    revenueUsd: (revenue.data || 0)/100
  })
}
