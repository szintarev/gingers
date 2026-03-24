import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { CartItem, ShippingInfo } from '@/contexts/CartContext'

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${ts}-${rand}`
}

export async function POST(req: NextRequest) {
  try {
    const { cart, shipping } = (await req.json()) as { cart: CartItem[]; shipping: ShippingInfo }

    if (!cart?.length || !shipping?.email) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 })
    }

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const orderNumber = generateOrderNumber()

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        status: 'pending',
        customerName: `${shipping.firstName} ${shipping.lastName}`,
        customerEmail: shipping.email,
        customerPhone: shipping.phone ?? '',
        customerAddress: shipping.address,
        customerCity: shipping.city,
        customerState: shipping.state ?? '',
        customerCountry: shipping.country,
        customerPostal: shipping.postalCode,
        customerNotes: shipping.notes ?? '',
        items: cart.map((item) => ({
          productName: item.name,
          productImage: item.image ?? '',
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: item.price * item.quantity,
        })),
        total,
      },
    })

    return NextResponse.json({ success: true, orderNumber })
  } catch (err) {
    console.error('Order error:', err)
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 })
  }
}
