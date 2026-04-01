'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ShoppingBag, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import type { OnApproveData } from '@paypal/react-paypal-js'
import { useCart, type ShippingInfo } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { COUNTRIES } from '@/lib/countries'
import { sendOrderEmail } from '@/lib/sendOrderEmail'

/*==================================================================
    CONSTANTS
==================================================================*/
const CURRENCY = '€'

const EMPTY_SHIPPING: ShippingInfo = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', postalCode: '', country: '', state: '', notes: '',
}

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'success'

/*==================================================================
    INLINE SVG ICONS
==================================================================*/
function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function RemoveIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

/*==================================================================
    CART DRAWER
    Rendered via createPortal into document.body so it sits above
    the fixed header (which has its own stacking context).
==================================================================*/
export function CartDrawer() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const { t } = useLanguage()
  const [step, setStep] = useState<CheckoutStep>('cart')
  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY_SHIPPING)
  const [error, setError] = useState('')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const idempotencyKey = useRef(crypto.randomUUID())

  const selectedCountry = COUNTRIES.find((c) => c.code === shipping.country)
  const states = selectedCountry?.states ?? []

  // Prevent portal render on server
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  function handleShippingChange(field: keyof ShippingInfo, value: string) {
    setShipping((prev) =>
      field === 'country' ? { ...prev, country: value, state: '' } : { ...prev, [field]: value }
    )
  }

  async function createPayPalOrder(): Promise<string> {
    const res = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: getTotalPrice().toFixed(2) }),
    })
    if (!res.ok) throw new Error('Failed to create PayPal order')
    const { orderID } = await res.json()
    return orderID
  }

  async function onPayPalApprove(data: OnApproveData): Promise<void> {
    setError('')
    setIsProcessingPayment(true)
    try {
      // 1. Capture payment server-side
      const captureRes = await fetch('/api/paypal/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderID: data.orderID }),
      })
      if (!captureRes.ok) throw new Error('capture')

      // 2. Create order in CMS
      const orderRes = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, shipping, idempotencyKey: idempotencyKey.current }),
      })
      if (!orderRes.ok) throw new Error('order')

      const { orderNumber } = await orderRes.json()
      await sendOrderEmail(cart, shipping, orderNumber)
      idempotencyKey.current = crypto.randomUUID()
      clearCart()
      setStep('success')
    } catch {
      setError(t('somethingWentWrong'))
      setIsProcessingPayment(false)
    }
  }

  function handleClose() {
    closeCart()
    setTimeout(() => { setStep('cart'); setShipping(EMPTY_SHIPPING); setError(''); setIsProcessingPayment(false) }, 300)
  }

  function handleBack() {
    if (step === 'shipping') setStep('cart')
    else if (step === 'payment') setStep('shipping')
  }

  const isShippingValid =
    shipping.firstName && shipping.lastName && shipping.email &&
    shipping.address && shipping.city && shipping.postalCode && shipping.country

  if (!mounted) return null

  const STEPS: CheckoutStep[] = ['cart', 'shipping', 'payment']
  const stepLabels: Record<string, string> = {
    cart: t('yourCart'),
    shipping: t('shippingDetails'),
    payment: t('payment'),
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 z-[10000] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[10000] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-14 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                {(step === 'shipping' || step === 'payment') && (
                  <button onClick={handleBack} className="text-gray-400 hover:text-gray-700 transition-colors -ml-1 p-1" aria-label={t('back')}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  {step !== 'success' && <ShoppingBag className="w-4 h-4 text-[#8B1538]" />}
                  {step === 'cart' && t('yourCart')}
                  {step === 'shipping' && t('shippingDetails')}
                  {step === 'payment' && t('payment')}
                  {step === 'success' && t('orderReceived')}
                </h2>
              </div>
              <button onClick={handleClose} className="text-gray-500 hover:text-red-500 transition-colors p-1 -mr-1" aria-label="Close">
                <CloseIcon size={16} />
              </button>
            </div>

            {/* Step tabs */}
            {step !== 'success' && (
              <div className="flex border-b border-gray-100 flex-shrink-0">
                {STEPS.map((s, i) => {
                  const active = step === s
                  return (
                    <div key={s} className="relative flex-1">
                      <div className={`px-3 py-2.5 text-xs font-medium transition-colors truncate ${active ? 'text-gray-900' : 'text-gray-400'}`}>
                        {i + 1}. {stepLabels[s]}
                      </div>
                      {active && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8B1538]" />}
                    </div>
                  )
                })}
                <div className="relative flex-1">
                  <div className="px-3 py-2.5 text-xs font-medium text-gray-400 truncate">4. {t('orderPlaced')}</div>
                </div>
              </div>
            )}

            {/* Content */}
            <PayPalScriptProvider options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
              currency: 'EUR',
              intent: 'capture',
            }}>
              <div className="flex-1 overflow-y-auto">
                {step === 'cart' && <CartStep removeFromCart={removeFromCart} updateQuantity={updateQuantity} clearCart={clearCart} t={t} />}
                {step === 'shipping' && <ShippingForm shipping={shipping} states={states} onChange={handleShippingChange} error={error} t={t} />}
                {step === 'payment' && (
                  <PaymentStep
                    getTotalPrice={getTotalPrice}
                    createOrder={createPayPalOrder}
                    onApprove={onPayPalApprove}
                    onError={() => setError(t('somethingWentWrong'))}
                    isProcessing={isProcessingPayment}
                    error={error}
                    t={t}
                  />
                )}
                {step === 'success' && <OrderSuccess t={t} onClose={handleClose} />}
              </div>

              {/* Footer */}
              {step !== 'success' && step !== 'payment' && cart.length > 0 && (
                <div className="border-t border-gray-100 px-6 py-5 space-y-4 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{t('total')}</span>
                    <span className="text-lg font-bold text-gray-900 tabular-nums">{CURRENCY}{getTotalPrice().toFixed(2)}</span>
                  </div>
                  {step === 'cart' && (
                    <button onClick={() => setStep('shipping')} className="w-full bg-[#8B1538] hover:bg-[#6B0F2B] text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors">
                      {t('proceedToCheckout')} <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  {step === 'shipping' && (
                    <button onClick={() => setStep('payment')} disabled={!isShippingValid} className="w-full bg-[#8B1538] hover:bg-[#6B0F2B] text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                      {t('continueToPayment')} <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </PayPalScriptProvider>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

/*==================================================================
    CART STEP — ITEM LIST
==================================================================*/
function CartStep({
  removeFromCart, updateQuantity, clearCart, t,
}: {
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, qty: number) => void
  clearCart: () => void
  t: (key: string) => string
}) {
  const { cart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 text-center px-8">
        <ShoppingBag className="w-10 h-10 text-gray-200 mb-4" />
        <p className="text-sm font-medium text-gray-700 mb-1">{t('emptyCart')}</p>
        <p className="text-xs text-gray-400">{t('emptyCartDesc')}</p>
      </div>
    )
  }

  return (
    <div>
      <ul className="divide-y divide-gray-100">
        {cart.map((item) => (
          <li key={item.id} className="flex gap-4 px-6 py-4">
            {item.image
              ? <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-50 flex-shrink-0" />
              : <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0" />
            }
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <button onClick={() => removeFromCart(item.id)} className="flex-shrink-0 text-gray-500 hover:text-red-500 transition-colors" aria-label={t('remove')}>
                  <RemoveIcon />
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-[#8B1538] hover:bg-[#8B1538]/10 transition-colors">
                    <MinusIcon />
                  </button>
                  <span className="text-xs font-semibold text-gray-900 w-6 text-center tabular-nums select-none">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-[#8B1538] hover:bg-[#8B1538]/10 transition-colors">
                    <PlusIcon />
                  </button>
                </div>
                <p className="text-sm font-semibold text-[#8B1538] tabular-nums">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="px-6 py-3 border-t border-gray-100">
        <button onClick={clearCart} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">{t('clearAllItems')}</button>
      </div>
    </div>
  )
}

/*==================================================================
    SHIPPING FORM
==================================================================*/
function ShippingForm({
  shipping, states, onChange, error, t,
}: {
  shipping: ShippingInfo
  states: { code: string; name: string }[]
  onChange: (field: keyof ShippingInfo, value: string) => void
  error: string
  t: (key: string) => string
}) {
  const input = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B1538]/25 focus:border-[#8B1538] transition-colors placeholder:text-gray-300 bg-white'
  const label = 'block text-xs font-medium text-gray-500 mb-1.5'

  return (
    <div className="px-6 py-5 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className={label}>{t('firstName')} *</label><input className={input} value={shipping.firstName} onChange={(e) => onChange('firstName', e.target.value)} placeholder="John" /></div>
        <div><label className={label}>{t('lastName')} *</label><input className={input} value={shipping.lastName} onChange={(e) => onChange('lastName', e.target.value)} placeholder="Doe" /></div>
      </div>
      <div><label className={label}>{t('emailAddress')} *</label><input type="email" className={input} value={shipping.email} onChange={(e) => onChange('email', e.target.value)} placeholder="john@example.com" /></div>
      <div><label className={label}>{t('phoneNumber')}</label><input type="tel" className={input} value={shipping.phone} onChange={(e) => onChange('phone', e.target.value)} placeholder="+1 234 567 8900" /></div>
      <div><label className={label}>{t('streetAddress')} *</label><input className={input} value={shipping.address} onChange={(e) => onChange('address', e.target.value)} placeholder="123 Main Street" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={label}>{t('city')} *</label><input className={input} value={shipping.city} onChange={(e) => onChange('city', e.target.value)} placeholder="New York" /></div>
        <div><label className={label}>{t('postalCode')} *</label><input className={input} value={shipping.postalCode} onChange={(e) => onChange('postalCode', e.target.value)} placeholder="10001" /></div>
      </div>
      <div>
        <label className={label}>{t('country')} *</label>
        <select className={input} value={shipping.country} onChange={(e) => onChange('country', e.target.value)}>
          <option value="">{t('selectCountry')}</option>
          {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
      </div>
      {shipping.country && (
        <div>
          <label className={label}>{t('stateRegion')}</label>
          {states.length > 0
            ? <select className={input} value={shipping.state} onChange={(e) => onChange('state', e.target.value)}><option value="">{t('selectState')}</option>{states.map((s) => <option key={s.code} value={s.name}>{s.name}</option>)}</select>
            : <input className={input} value={shipping.state} onChange={(e) => onChange('state', e.target.value)} placeholder={t('stateRegion')} />
          }
        </div>
      )}
      <div>
        <label className={label}>{t('orderNotes')}</label>
        <textarea className={`${input} resize-none`} rows={3} value={shipping.notes} onChange={(e) => onChange('notes', e.target.value)} placeholder={t('deliveryInstructions')} />
      </div>
      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
    </div>
  )
}

/*==================================================================
    PAYMENT STEP — PAYPAL BUTTONS
==================================================================*/
function PaymentStep({
  getTotalPrice, createOrder, onApprove, onError, isProcessing, error, t,
}: {
  getTotalPrice: () => number
  createOrder: () => Promise<string>
  onApprove: (data: OnApproveData) => Promise<void>
  onError: (err: unknown) => void
  isProcessing: boolean
  error: string
  t: (key: string) => string
}) {
  return (
    <div className="px-6 py-5 space-y-4">
      {/* Order total */}
      <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">{t('total')}</span>
        <span className="text-lg font-bold text-gray-900 tabular-nums">{CURRENCY}{getTotalPrice().toFixed(2)}</span>
      </div>

      {/* PayPal buttons or processing overlay */}
      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B1538]" />
          <p className="text-sm text-gray-500">{t('completingOrder')}</p>
        </div>
      ) : (
        <PayPalButtons
          style={{ layout: 'vertical', shape: 'rect', label: 'pay', height: 48 }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          disabled={isProcessing}
        />
      )}

      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
    </div>
  )
}

/*==================================================================
    ORDER SUCCESS SCREEN
==================================================================*/
function OrderSuccess({ t, onClose }: { t: (key: string) => string; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-16 text-center px-8">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5 text-green-500">
        <CheckIcon />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{t('orderReceived')}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-8">{t('orderThankYou')}</p>
      <button onClick={onClose} className="w-full bg-[#8B1538] hover:bg-[#6B0F2B] text-white py-3 rounded-xl text-sm font-medium transition-colors">
        {t('continueShopping')}
      </button>
    </div>
  )
}
