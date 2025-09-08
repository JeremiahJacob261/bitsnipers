import nodemailer from 'nodemailer'

export function createTransport() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || 465)
  const user = process.env.SMTP_USER || 'akpomoshix@gmail.com'
  const pass = process.env.SMTP_PASS || 'soqx tkmf pmue gclu'


  
  if (!host || !user || !pass) {
    throw new Error('SMTP configuration missing (SMTP_HOST, SMTP_USER, SMTP_PASS)')
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465
    auth: { user, pass },
  })

  return transporter
}

export async function sendOtpEmail(to: string, code: string) {
  const transporter = createTransport()
  const from = "akpomoshix@gmail.com"!
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const html = `
  <div style="font-family:Inter,system-ui,-apple-system;line-height:1.6">
    <h2>BitSnipers Login Code</h2>
    <p>Your one-time code is:</p>
    <div style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</div>
    <p>This code expires in 10 minutes. If you did not request it, you can ignore this message.</p>
    <p>Return to <a href="${site}">${site}</a></p>
  </div>`

  await transporter.sendMail({
    to,
    from,
    subject: 'Your BitSnipers Login Code',
    html,
  })
}
