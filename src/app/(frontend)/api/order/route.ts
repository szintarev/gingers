import { NextRequest, NextResponse } from 'next/server'
import { transporter } from '@/lib/mailer'
import type { CartItem, ShippingInfo } from '@/contexts/CartContext'

export async function POST(req: NextRequest) {
  try {
    const { cart, shipping } = (await req.json()) as { cart: CartItem[]; shipping: ShippingInfo }

    if (!cart?.length || !shipping?.email) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 })
    }

    const itemsHtml = cart
      .map(
        (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${item.name}${item.weight ? ` (${item.weight})` : ''}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`,
      )
      .join('')

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

    const emailHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
      <div style="background:#8B1538;padding:24px 32px;">
        <h1 style="color:white;margin:0;font-size:24px;">New Order Received</h1>
      </div>
      <div style="padding:32px;">
        <h2 style="font-size:16px;color:#8B1538;margin-top:0;">Customer Details</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:4px 0;color:#666;width:140px;">Name</td><td>${shipping.firstName} ${shipping.lastName}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Email</td><td>${shipping.email}</td></tr>
          ${shipping.phone ? `<tr><td style="padding:4px 0;color:#666;">Phone</td><td>${shipping.phone}</td></tr>` : ''}
          <tr><td style="padding:4px 0;color:#666;">Address</td><td>${shipping.address}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">City</td><td>${shipping.city}</td></tr>
          ${shipping.state ? `<tr><td style="padding:4px 0;color:#666;">State</td><td>${shipping.state}</td></tr>` : ''}
          <tr><td style="padding:4px 0;color:#666;">Country</td><td>${shipping.country}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Postal Code</td><td>${shipping.postalCode}</td></tr>
          ${shipping.notes ? `<tr><td style="padding:4px 0;color:#666;vertical-align:top;">Notes</td><td>${shipping.notes}</td></tr>` : ''}
        </table>

        <h2 style="font-size:16px;color:#8B1538;margin-top:32px;">Order Items</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="background:#f9f9f9;">
              <th style="padding:8px 12px;text-align:left;color:#666;font-weight:600;">Product</th>
              <th style="padding:8px 12px;text-align:center;color:#666;font-weight:600;">Qty</th>
              <th style="padding:8px 12px;text-align:right;color:#666;font-weight:600;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:12px;text-align:right;font-weight:700;font-size:15px;">Total</td>
              <td style="padding:12px;text-align:right;font-weight:700;font-size:15px;color:#8B1538;">$${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>`

    const contactEmail = process.env.CONTACT_EMAIL
    if (!contactEmail) {
      return NextResponse.json({ error: 'Contact email not configured' }, { status: 500 })
    }

    await transporter.sendMail({
      from: `Gingers Orders <${process.env.SMTP_USER}>`,
      to: contactEmail,
      replyTo: shipping.email,
      subject: `New Order from ${shipping.firstName} ${shipping.lastName}`,
      html: emailHtml,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Order email error:', err)
    return NextResponse.json({ error: 'Failed to send order' }, { status: 500 })
  }
}
