'use client'

import React, { useState, useTransition, useRef } from 'react'
import {
  ShoppingBag, Minus, Plus, Trash2, RefreshCw,
  ArrowRight, ChevronLeft, Loader2, Package,
} from 'lucide-react'
import Link from 'next/link'
import { useCart, type ShippingInfo } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { COUNTRIES } from '@/lib/countries'
import { sendOrderEmail } from '@/lib/sendOrderEmail'

const CURRENCY = '€'

const EMPTY_SHIPPING: ShippingInfo = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', postalCode: '', country: '', state: '', notes: '',
}

type Step = 'cart' | 'shipping' | 'success'

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B1538]/30 focus:border-[#8B1538] transition-colors placeholder:text-gray-400 bg-white'
const labelClass = 'block text-xs font-medium text-gray-500 mb-1.5'

export function CartBlockComponent() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart()
  const { t } = useLanguage()
  const [step, setStep] = useState<Step>('cart')
  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY_SHIPPING)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const idempotencyKey = useRef(crypto.randomUUID())

  const total = getTotalPrice()
  const selectedCountry = COUNTRIES.find((c) => c.code === shipping.country)
  const states = selectedCountry?.states ?? []
  const isShippingValid = shipping.firstName && shipping.lastName && shipping.email && shipping.address && shipping.city && shipping.postalCode && shipping.country

  function handleShippingChange(field: keyof ShippingInfo, value: string) {
    setShipping((prev) => field === 'country' ? { ...prev, country: value, state: '' } : { ...prev, [field]: value })
  }

  function handlePlaceOrder() {
    setError('')
    startTransition(async () => {
      try {
        const res = await fetch('/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart, shipping, idempotencyKey: idempotencyKey.current }),
        })
        if (!res.ok) throw new Error()
        const { orderNumber } = await res.json()
        await sendOrderEmail(cart, shipping, orderNumber)
        idempotencyKey.current = crypto.randomUUID()
        clearCart()
        setStep('success')
      } catch {
        setError(t('somethingWentWrong'))
      }
    })
  }

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div style={{ backgroundColor: '#8B1538', position: 'relative', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Back link */}
          {step === 'shipping' ? (
            <button onClick={() => setStep('cart')} className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-sm mb-6">
              <ChevronLeft className="w-4 h-4" /> {t('backToCart')}
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-sm mb-6">
              <ChevronLeft className="w-4 h-4" /> {t('continueShopping')}
            </Link>
          )}

          {/* Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
              <ShoppingBag className="w-7 h-7" style={{ color: '#8B1538' }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {step === 'success' ? t('orderReceived') : t('yourCart')}
              </h1>
              <p className="text-white/60 text-sm mt-1">
                {step === 'cart' && `${getTotalItems()} ${t('items')}`}
                {step === 'shipping' && t('shippingDetails')}
                {step === 'success' && '✓'}
              </p>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden', lineHeight: 0 }}>
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" style={{ width: '100%', height: '3.5rem', display: 'block' }}>
            <path d="M0,32 C240,56 480,8 720,28 C960,48 1200,8 1440,24 L1440,56 L0,56 Z" fill="#f9fafb" />
          </svg>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 pt-8">

        {/* Success */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('orderReceived')}</h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8">{t('orderThankYou')}</p>
            <Link href="/" style={{ backgroundColor: '#8B1538' }} className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
              {t('continueShopping')}
            </Link>
          </div>
        )}

        {/* Empty cart */}
        {step === 'cart' && cart.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
              <ShoppingBag className="w-9 h-9 text-gray-300" />
            </div>
            <p className="text-gray-800 font-semibold text-lg mb-1">{t('emptyCart')}</p>
            <p className="text-gray-400 text-sm mb-8">{t('emptyCartDesc')}</p>
            <Link href="/" style={{ backgroundColor: '#8B1538' }} className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
              {t('browseProducts')}
            </Link>
          </div>
        )}

        {/* Cart / Shipping */}
        {step !== 'success' && cart.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left */}
            <div className="lg:col-span-2 space-y-4">

              {step === 'cart' && (
                <>
                  {/* Items */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 p-5 items-start">
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-gray-100 flex-shrink-0" />
                          : <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0" />
                        }
                        <div className="flex-1 min-w-0">
                          {item.category && (
                            <span className="inline-block text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-2 py-0.5 mb-1">{item.category}</span>
                          )}
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          {item.weight && <p className="text-gray-400 text-xs mt-0.5">{item.weight}</p>}
                          <div className="flex items-center gap-4 mt-3">
                            {/* Quantity stepper */}
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-semibold text-gray-900 min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" /> {t('remove')}
                            </button>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-gray-900">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{CURRENCY}{item.price.toFixed(2)} {t('each')}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button onClick={clearCart} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" /> {t('clearAllItems')}
                    </button>
                  </div>
                </>
              )}

              {step === 'shipping' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelClass}>{t('firstName')} *</label><input className={inputClass} value={shipping.firstName} onChange={(e) => handleShippingChange('firstName', e.target.value)} placeholder="John" /></div>
                    <div><label className={labelClass}>{t('lastName')} *</label><input className={inputClass} value={shipping.lastName} onChange={(e) => handleShippingChange('lastName', e.target.value)} placeholder="Doe" /></div>
                  </div>
                  <div><label className={labelClass}>{t('emailAddress')} *</label><input type="email" className={inputClass} value={shipping.email} onChange={(e) => handleShippingChange('email', e.target.value)} placeholder="john@example.com" /></div>
                  <div><label className={labelClass}>{t('phoneNumber')}</label><input type="tel" className={inputClass} value={shipping.phone} onChange={(e) => handleShippingChange('phone', e.target.value)} placeholder="+1 234 567 8900" /></div>
                  <div><label className={labelClass}>{t('streetAddress')} *</label><input className={inputClass} value={shipping.address} onChange={(e) => handleShippingChange('address', e.target.value)} placeholder="123 Main Street" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelClass}>{t('city')} *</label><input className={inputClass} value={shipping.city} onChange={(e) => handleShippingChange('city', e.target.value)} placeholder="New York" /></div>
                    <div><label className={labelClass}>{t('postalCode')} *</label><input className={inputClass} value={shipping.postalCode} onChange={(e) => handleShippingChange('postalCode', e.target.value)} placeholder="10001" /></div>
                  </div>
                  <div>
                    <label className={labelClass}>{t('country')} *</label>
                    <select className={inputClass} value={shipping.country} onChange={(e) => handleShippingChange('country', e.target.value)}>
                      <option value="">{t('selectCountry')}</option>
                      {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </div>
                  {shipping.country && (
                    <div>
                      <label className={labelClass}>{t('stateRegion')}</label>
                      {states.length > 0
                        ? <select className={inputClass} value={shipping.state} onChange={(e) => handleShippingChange('state', e.target.value)}><option value="">{t('selectState')}</option>{states.map((s) => <option key={s.code} value={s.name}>{s.name}</option>)}</select>
                        : <input className={inputClass} value={shipping.state} onChange={(e) => handleShippingChange('state', e.target.value)} placeholder={t('stateRegion')} />
                      }
                    </div>
                  )}
                  <div><label className={labelClass}>{t('orderNotes')}</label><textarea className={`${inputClass} resize-none`} rows={3} value={shipping.notes} onChange={(e) => handleShippingChange('notes', e.target.value)} placeholder={t('deliveryInstructions')} /></div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right — Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
                <div style={{ backgroundColor: '#8B1538' }} className="px-5 py-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-white/80" />
                  <h2 className="font-semibold text-white">{t('orderSummary')}</h2>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-600">
                      <span className="truncate mr-2">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                      <span className="flex-shrink-0 font-medium">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600"><span>{t('subtotal')}</span><span>{CURRENCY}{total.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm text-gray-600"><span>{t('shippingCost')}</span><span className="text-gray-400 text-xs">{t('calculatedAtCheckout')}</span></div>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                    <span className="font-semibold text-gray-900">{t('total')}</span>
                    <span className="text-xl font-bold" style={{ color: '#8B1538' }}>{CURRENCY}{total.toFixed(2)}</span>
                  </div>

                  {/* CTA */}
                  <div className="pt-2">
                    {step === 'cart' && (
                      <button onClick={() => setStep('shipping')} style={{ backgroundColor: '#8B1538' }} className="w-full text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                        {t('proceedToCheckout')} <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                    {step === 'shipping' && (
                      <button onClick={handlePlaceOrder} disabled={!isShippingValid || isPending} style={{ backgroundColor: '#8B1538' }} className="w-full text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                        {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('placingOrder')}</> : t('placeOrder')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
