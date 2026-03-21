'use client'

import React from 'react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

interface ProductCardProps {
  id: number
  title: string
  price: number
  description: string
  imageUrl: string | null
  status: 'in-stock' | 'out-of-stock' | 'pre-order'
  slug: string
}

export function ProductCard({ id, title, price, description, imageUrl, status, slug }: ProductCardProps) {
  const { addToCart, openCart } = useCart()

  function handleAddToCart() {
    addToCart({ id, name: title, price, image: imageUrl ?? '', category: slug })
    openCart()
  }

  const badgeLabel = status === 'out-of-stock' ? 'Out of Stock' : status === 'pre-order' ? 'Pre-order' : null

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">

      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-14 h-14 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Status badge — top left */}
        {badgeLabel && (
          <span
            className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: status === 'out-of-stock' ? '#6b7280' : '#8B1538' }}
          >
            {badgeLabel}
          </span>
        )}

        {/* Heart — top right */}
        <button
          aria-label="Save product"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart className="w-4 h-4 text-gray-400 hover:text-red-400 transition-colors" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-[#8B1538] transition-colors">
          {title}
        </h3>

        {description && (
          <p className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2 flex-1">
            {description}
          </p>
        )}

        {/* Stars */}
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-gray-400 text-xs ml-1">5 reviews</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="font-bold text-base" style={{ color: '#8B1538' }}>
            €{price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={status === 'out-of-stock'}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#8B1538' }}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {status === 'out-of-stock' ? 'Unavailable' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
