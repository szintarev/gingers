import emailjs from '@emailjs/browser'
import type { CartItem, ShippingInfo } from '@/contexts/CartContext'

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID!
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!

export async function sendOrderEmail(
  cart: CartItem[],
  shipping: ShippingInfo,
  orderNumber: string,
): Promise<void> {
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const serverUrl = (process.env.NEXT_PUBLIC_SERVER_URL ?? '').replace(/\/$/, '')

  function resolveImageUrl(url: string | undefined): string | undefined {
    if (!url) return undefined
    if (url.startsWith('http://localhost') || url.startsWith('/')) {
      return `${serverUrl}${url.startsWith('/') ? url : new URL(url).pathname}`
    }
    return url
  }

  const itemsHtml = cart
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;vertical-align:middle;">
            ${
              resolveImageUrl(item.image)
                ? `<img src="${resolveImageUrl(item.image)}" alt="${item.name}" width="56" height="56" style="width:56px;height:56px;object-fit:cover;border-radius:6px;display:inline-block;vertical-align:middle;margin-right:10px;">`
                : ''
            }
            <span style="vertical-align:middle;font-weight:500;">${item.name}${item.weight ? ` <span style="color:#999;font-size:12px;">(${item.weight})</span>` : ''}</span>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;color:#8B1538;">€${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`,
    )
    .join('')

  const templateParams = {
    order_number: orderNumber,
    customer_name: `${shipping.firstName} ${shipping.lastName}`,
    customer_email: shipping.email,
    customer_phone: shipping.phone || '—',
    customer_address: shipping.address,
    customer_city: shipping.city,
    customer_state: shipping.state || '—',
    customer_country: shipping.country,
    customer_postal: shipping.postalCode,
    customer_notes: shipping.notes || '—',
    order_items_html: itemsHtml,
    order_total: `€${total.toFixed(2)}`,
  }

  await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY })
}
