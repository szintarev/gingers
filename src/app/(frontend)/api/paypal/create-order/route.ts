import { NextRequest, NextResponse } from 'next/server'
import { getPayPalAccessToken, PAYPAL_BASE } from '@/lib/paypal'

export async function POST(req: NextRequest) {
  try {
    const { amount } = (await req.json()) as { amount: string }

    const accessToken = await getPayPalAccessToken()

    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: amount,
            },
          },
        ],
      }),
    })

    const order = await res.json()
    return NextResponse.json({ orderID: order.id })
  } catch (err) {
    console.error('PayPal create-order error:', err)
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 })
  }
}
