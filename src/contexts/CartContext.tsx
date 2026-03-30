'use client'

import React, { createContext, use, useState, useEffect, useCallback } from 'react'

/*==================================================================
    TYPES
==================================================================*/
export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  weight?: string
  category?: string
}

export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  state: string
  notes: string
}

interface CartContextValue {
  cart: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  clearCart: () => void
}

/*==================================================================
    CONTEXT
==================================================================*/
const CartContext = createContext<CartContextValue | null>(null)

/*==================================================================
    PROVIDER
==================================================================*/
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gingers_cart')
      if (stored) setCart(JSON.parse(stored))
    } catch {}
  }, [])

  // Persist to localStorage on every cart change
  useEffect(() => {
    try {
      localStorage.setItem('gingers_cart', JSON.stringify(cart))
    } catch {}
  }, [cart])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...item, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity < 1) { setCart((prev) => prev.filter((i) => i.id !== id)); return }
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i))
  }, [])

  const getTotalItems = useCallback(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart])
  const getTotalPrice = useCallback(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart])
  const clearCart = useCallback(() => setCart([]), [])

  return (
    <CartContext.Provider value={{ cart, isOpen, openCart, closeCart, addToCart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

/*==================================================================
    HOOK
==================================================================*/
export function useCart(): CartContextValue {
  const ctx = use(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
