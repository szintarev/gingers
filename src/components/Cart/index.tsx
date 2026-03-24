'use client'

import React, { useState, useTransition } from 'react'
import { X, Minus, Plus, Trash2, ShoppingBag, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useCart, type ShippingInfo } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { COUNTRIES } from '@/lib/countries'
import { sendOrderEmail } from '@/lib/sendOrderEmail'

const EMPTY_SHIPPING: ShippingInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
  state: '',
  notes: '',
}

type CheckoutStep = 'cart' | 'shipping' | 'success'

export function CartDrawer() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const { t } = useLanguage()
  const [step, setStep] = useState<CheckoutStep>('cart')
  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY_SHIPPING)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const selectedCountry = COUNTRIES.find((c) => c.code === shipping.country)
  const states = selectedCountry?.states ?? []

  function handleShippingChange(field: keyof ShippingInfo, value: string) {
    setShipping((prev) => {
      // Reset state when country changes since states differ per country
      if (field === 'country') return { ...prev, country: value, state: '' }
      return { ...prev, [field]: value }
    })
  }

  function handlePlaceOrder() {
    setError('')
    startTransition(async () => {
      try {
        const res = await fetch('/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart, shipping }),
        })
        if (!res.ok) throw new Error()
        const { orderNumber } = await res.json()
        await sendOrderEmail(cart, shipping, orderNumber)
        clearCart()
        setStep('success')
      } catch {
        setError('Something went wrong. Please try again.')
      }
    })
  }

  function handleClose() {
    closeCart()
    // Reset to cart step after drawer closes
    setTimeout(() => {
      setStep('cart')
      setShipping(EMPTY_SHIPPING)
      setError('')
    }, 300)
  }

  const isShippingValid =
    shipping.firstName &&
    shipping.lastName &&
    shipping.email &&
    shipping.address &&
    shipping.city &&
    shipping.postalCode &&
    shipping.country

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              {step === 'shipping' && (
                <button
                  onClick={() => setStep('cart')}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#8B1538]" />
                {step === 'cart' && t('yourCart')}
                {step === 'shipping' && 'Shipping Details'}
                {step === 'success' && 'Order Placed!'}
              </h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {step === 'cart' && (
                <CartItems
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  t={t}
                />
              )}
              {step === 'shipping' && (
                <ShippingForm
                  shipping={shipping}
                  states={states}
                  onChange={handleShippingChange}
                  error={error}
                />
              )}
              {step === 'success' && <OrderSuccess />}
            </div>

            {/* Footer */}
            {step !== 'success' && cart.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 space-y-4">
                <div className="flex justify-between text-base font-semibold text-gray-900">
                  <div>Total</div>
                  <div>${getTotalPrice().toFixed(2)}</div>
                </div>
                {step === 'cart' && (
                  <button
                    onClick={() => setStep('shipping')}
                    className="w-full bg-[#8B1538] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#6B0F2B] transition-colors"
                  >
                    Proceed to Checkout
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                {step === 'shipping' && (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={!isShippingValid || isPending}
                    className="w-full bg-[#8B1538] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#6B0F2B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function CartItems({
  removeFromCart,
  updateQuantity,
  t,
}: {
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, qty: number) => void
  t: (key: string) => string
}) {
  const { cart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center px-6">
        <ShoppingBag className="w-16 h-16 text-gray-200 pb-4" />
        <p className="text-gray-500 font-medium">{t('emptyCart')}</p>
        <p className="text-gray-400 text-sm pt-1">{t('emptyCartDesc')}</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-4 space-y-4">
      {cart.map((item) => (
        <div key={item.id} className="flex gap-4 py-4 border-b border-gray-50 last:border-0">
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg bg-gray-100 flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
            {item.weight && <p className="text-gray-400 text-xs pt-0.5">{item.weight}</p>}
            <p className="text-[#8B1538] font-semibold text-sm pt-1">${item.price.toFixed(2)}</p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-3 h-3 text-gray-600" />
              </button>
              <div className="text-sm font-medium w-6 text-center">{item.quantity}</div>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-gray-300 hover:text-red-400 transition-colors self-start pt-1"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

function ShippingForm({
  shipping,
  states,
  onChange,
  error,
}: {
  shipping: ShippingInfo
  states: { code: string; name: string }[]
  onChange: (field: keyof ShippingInfo, value: string) => void
  error: string
}) {
  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B1538]/30 focus:border-[#8B1538] transition-colors placeholder:text-gray-400'
  const labelClass = 'block text-xs font-medium text-gray-600 mb-1.5'

  return (
    <div className="px-6 py-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>First Name *</label>
          <input
            className={inputClass}
            value={shipping.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            placeholder="John"
          />
        </div>
        <div>
          <label className={labelClass}>Last Name *</label>
          <input
            className={inputClass}
            value={shipping.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Email Address *</label>
        <input
          type="email"
          className={inputClass}
          value={shipping.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label className={labelClass}>Phone Number</label>
        <input
          type="tel"
          className={inputClass}
          value={shipping.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="+1 234 567 8900"
        />
      </div>

      <div>
        <label className={labelClass}>Street Address *</label>
        <input
          className={inputClass}
          value={shipping.address}
          onChange={(e) => onChange('address', e.target.value)}
          placeholder="123 Main Street"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>City *</label>
          <input
            className={inputClass}
            value={shipping.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="New York"
          />
        </div>
        <div>
          <label className={labelClass}>Postal Code *</label>
          <input
            className={inputClass}
            value={shipping.postalCode}
            onChange={(e) => onChange('postalCode', e.target.value)}
            placeholder="10001"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Country *</label>
        <select
          className={inputClass}
          value={shipping.country}
          onChange={(e) => onChange('country', e.target.value)}
        >
          <option value="">Select country...</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* State/region — select for countries with known states, text input otherwise */}
      {shipping.country && (
        <div>
          <label className={labelClass}>State / Region</label>
          {states.length > 0 ? (
            <select
              className={inputClass}
              value={shipping.state}
              onChange={(e) => onChange('state', e.target.value)}
            >
              <option value="">Select state...</option>
              {states.map((s) => (
                <option key={s.code} value={s.name}>{s.name}</option>
              ))}
            </select>
          ) : (
            <input
              className={inputClass}
              value={shipping.state}
              onChange={(e) => onChange('state', e.target.value)}
              placeholder="Region / Province"
            />
          )}
        </div>
      )}

      <div>
        <label className={labelClass}>Order Notes</label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={3}
          value={shipping.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Special delivery instructions, allergies, etc."
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  )
}

function OrderSuccess() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-center px-6">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center pb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 pb-2">Order Received!</h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        Thank you for your order. We&apos;ve sent a confirmation to your email and will be in touch shortly.
      </p>
    </div>
  )
}
