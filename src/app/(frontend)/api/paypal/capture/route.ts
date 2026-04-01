import { NextRequest, NextResponse } from 'next/server'
import { getPayPalAccessToken, PAYPAL_BASE } from '@/lib/paypal'

export async function POST(req: NextRequest) {
  try {
    const { orderID } = (await req.json()) as { orderID: string }

    const accessToken = await getPayPalAccessToken()

    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const error = await res.json()
      console.error('PayPal capture error:', error)
      return NextResponse.json({ error: 'Payment capture failed' }, { status: 400 })
    }

    const data = await res.json()
    const captureID = data.purchase_units?.[0]?.payments?.captures?.[0]?.id
    return NextResponse.json({ success: true, captureID })
  } catch (err) {
    console.error('PayPal capture error:', err)
    return NextResponse.json({ error: 'Failed to capture payment' }, { status: 500 })
  }
}
