import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { sendOtpEmail } from '@/lib/mailer'
import { now as memNow } from '@/lib/otp-store'
import { upsertOtp, readOtp, now } from '@/lib/otp-repo'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

  const normalized = String(email).trim().toLowerCase()
  // Basic rate limit: if an unexpired code exists, reuse remaining window
  const existing = await readOtp(normalized)
  if (existing && existing.expiresAt > now()) {
      // Don't reveal if a code exists; return ok to avoid leaking state
      return NextResponse.json({ ok: true })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const hash = crypto.createHash('sha256').update(code).digest('hex')

  const expiresAt = now() + 10 * 60 * 1000
  await upsertOtp(normalized, { hash, expiresAt, attempts: 0 })
    await sendOtpEmail(normalized, code)

    return NextResponse.json({ ok: true })
  } catch (e: any) {
  return NextResponse.json({ error: e?.message || 'Failed to send code' }, { status: 500 })
  }
}
