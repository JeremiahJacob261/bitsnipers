import crypto from 'crypto'
import { getSupabaseAdmin } from './supabase-server'
import { getOtp as memGet, setOtp as memSet, deleteOtp as memDel, now as memNow } from './otp-store'

export type OtpRecord = { hash: string; expiresAt: number; attempts: number }

export function now() {
  return memNow()
}

export async function readOtp(email: string): Promise<OtpRecord | null> {
  const admin = getSupabaseAdmin()
  if (admin) {
    const { data, error } = await admin
      .from('bitsnips_otps')
      .select('hash, expires_at, attempts')
      .eq('email', email)
      .single()
    if (error || !data) return null
    return { hash: data.hash, expiresAt: new Date(data.expires_at as any).getTime(), attempts: data.attempts ?? 0 }
  }
  return memGet(email) ?? null
}

export async function upsertOtp(email: string, record: OtpRecord): Promise<void> {
  const admin = getSupabaseAdmin()
  if (admin) {
    const expires_at = new Date(record.expiresAt)
    const { error } = await admin
      .from('bitsnips_otps')
      .upsert({ email, hash: record.hash, expires_at, attempts: record.attempts })
    if (error) throw error
    return
  }
  memSet(email, record)
}

export async function incrementAttempts(email: string, current: OtpRecord): Promise<OtpRecord> {
  const next = { ...current, attempts: current.attempts + 1 }
  const admin = getSupabaseAdmin()
  if (admin) {
    await admin.from('bitsnips_otps').update({ attempts: next.attempts }).eq('email', email)
  } else {
    memSet(email, next)
  }
  return next
}

export async function deleteOtp(email: string): Promise<void> {
  const admin = getSupabaseAdmin()
  if (admin) {
    await admin.from('bitsnips_otps').delete().eq('email', email)
    return
  }
  memDel(email)
}

export function hashCode(code: string) {
  return crypto.createHash('sha256').update(code).digest('hex')
}
