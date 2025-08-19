import { cookies } from 'next/headers'

const COOKIE_NAME = 'bitsnips_session'
const TEN_DAYS = 10 * 24 * 60 * 60

export async function setSession(email: string) {
  const jar = await cookies()
  jar.set(COOKIE_NAME, email, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TEN_DAYS,
  })
}

export async function getSession(): Promise<string | null> {
  const jar = await cookies()
  const c = jar.get(COOKIE_NAME)
  return c?.value ?? null
}

export async function clearSession() {
  const jar = await cookies()
  jar.delete(COOKIE_NAME)
}
