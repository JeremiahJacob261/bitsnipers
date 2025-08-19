import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { sanitizeCode } from '@/lib/otp-store'
import { readOtp, deleteOtp as repoDelete, incrementAttempts, hashCode, now } from '@/lib/otp-repo'
import { setSession } from '@/lib/session'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {

    console.log('Verifying OTP...');
  const { email, code } = await request.json()
  const normalized = typeof email === 'string' ? email.trim().toLowerCase() : ''
  const cleaned = typeof code === 'string' ? sanitizeCode(code) : ''
  if (!normalized || cleaned.length !== 6) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

  const record = await readOtp(normalized)
  console.log('OTP Record:', record);

  if (!record) return NextResponse.json({ error: 'Code not found' }, { status: 400 })

    if (record.expiresAt < now()) {
      await repoDelete(normalized)
      return NextResponse.json({ error: 'Code expired' }, { status: 400 })
    }

    const hash = hashCode(cleaned)
    if (hash !== record.hash) {
      const next = await incrementAttempts(normalized, record)
      if (next.attempts > 5) await repoDelete(normalized)
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    await repoDelete(normalized)
    // set a session cookie
    await setSession(normalized)
    // ensure a profile row exists by email (simple upsert)
    const admin = getSupabaseAdmin()
    if (admin) {
      await admin.from('bitsnips_profiles').upsert({ email: normalized }, { onConflict: 'email' })
    }
    console.log(`OTP verified for ${normalized}`)
    return NextResponse.json({ ok: true, verified: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to verify code' }, { status: 500 })
  }
}
