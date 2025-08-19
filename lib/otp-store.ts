type OtpRecord = {
  hash: string
  expiresAt: number
  attempts: number
}
// Reuse a single in-memory store across dev reloads and route module instances.
declare global {
  // eslint-disable-next-line no-var
  var __bitsnipsOtpStore: Map<string, OtpRecord> | undefined
}

const store: Map<string, OtpRecord> = globalThis.__bitsnipsOtpStore ?? new Map<string, OtpRecord>()
if (!globalThis.__bitsnipsOtpStore) {
  globalThis.__bitsnipsOtpStore = store
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function sanitizeCode(code: string) {
  return code.replace(/\D/g, "").trim()
}

export function setOtp(email: string, record: OtpRecord) {
  store.set(normalizeEmail(email), record)
}

export function getOtp(email: string): OtpRecord | undefined {
  return store.get(normalizeEmail(email))
}

export function deleteOtp(email: string) {
  store.delete(normalizeEmail(email))
}

export function now() {
  return Date.now()
}
