import { NextRequest, NextResponse } from 'next/server'
import { transporter } from '@/lib/mailer'

const recentSubmissions = new Map<string, number>()
const COOLDOWN_MS = 60_000

export interface PartnershipFormData {
  companyName: string
  contactName: string
  email: string
  phone: string
  country: string
  partnershipType: string
  message: string
}

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as PartnershipFormData

    if (!data.companyName || !data.email || !data.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const key = data.email.toLowerCase()
    const last = recentSubmissions.get(key) ?? 0
    if (Date.now() - last < COOLDOWN_MS) {
      return NextResponse.json({ success: true })
    }
    recentSubmissions.set(key, Date.now())

    const emailHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
      <div style="background:#8B1538;padding:24px 32px;">
        <h1 style="color:white;margin:0;font-size:24px;">New Partnership Inquiry</h1>
      </div>
      <div style="padding:32px;">
        <h2 style="font-size:16px;color:#8B1538;margin-top:0;">Contact Information</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:4px 0;color:#666;width:160px;">Company</td><td>${data.companyName}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Contact Person</td><td>${data.contactName}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Email</td><td>${data.email}</td></tr>
          ${data.phone ? `<tr><td style="padding:4px 0;color:#666;">Phone</td><td>${data.phone}</td></tr>` : ''}
          ${data.country ? `<tr><td style="padding:4px 0;color:#666;">Country</td><td>${data.country}</td></tr>` : ''}
          ${data.partnershipType ? `<tr><td style="padding:4px 0;color:#666;">Partnership Type</td><td>${data.partnershipType}</td></tr>` : ''}
        </table>

        <h2 style="font-size:16px;color:#8B1538;margin-top:32px;">Message</h2>
        <p style="font-size:14px;line-height:1.7;color:#333;background:#f9f9f9;padding:16px;border-radius:8px;">${data.message.replace(/\n/g, '<br>')}</p>
      </div>
    </div>`

    const contactEmail = process.env.CONTACT_EMAIL
    if (!contactEmail) {
      return NextResponse.json({ error: 'Contact email not configured' }, { status: 500 })
    }

    await transporter.sendMail({
      from: `Gingers Partnerships <${process.env.SMTP_USER}>`,
      to: contactEmail,
      replyTo: data.email,
      subject: `Partnership Inquiry from ${data.companyName}`,
      html: emailHtml,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Partnership email error:', err)
    return NextResponse.json({ error: 'Failed to send inquiry' }, { status: 500 })
  }
}
