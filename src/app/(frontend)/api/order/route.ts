import { NextRequest, NextResponse } from 'next/server'
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

    const orderNumber = generateOrderNumber()
    return NextResponse.json({ success: true, orderNumber })
  } catch (err) {
    console.error('Order error:', err)
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 })
  }
}
