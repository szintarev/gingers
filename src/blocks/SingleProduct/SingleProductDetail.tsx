'use client'

import React, { useState } from 'react'
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

interface NutritionFact {
  label: string
  value: string
}

interface SingleProductDetailProps {
  id: number
  title: string
  price: number
  description: string
  status: 'in-stock' | 'out-of-stock' | 'pre-order'
  slug: string
  images: string[]
  features: string[]
  ingredients: string[]
  nutritionFacts: NutritionFact[]
}

export function SingleProductDetail({
  id,
  title,
  price,
  description,
  status,
  slug,
  images,
  features,
  ingredients,
  nutritionFacts,
}: SingleProductDetailProps) {
  const { addToCart, openCart } = useCart()
  const [activeImage, setActiveImage] = useState(0)

  function handleAddToCart() {
    addToCart({ id, name: title, price, image: images[0] ?? '', category: slug })
    openCart()
  }

  const badgeLabel =
    status === 'out-of-stock' ? 'Out of Stock' : status === 'pre-order' ? 'Pre-order' : null

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Image gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              {images.length > 0 ? (
                <img
                  src={images[activeImage]}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-20 h-20 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {badgeLabel && (
                <span
                  className="absolute top-4 left-4 text-xs font-medium px-3 py-1.5 rounded-full text-white"
                  style={{ backgroundColor: status === 'out-of-stock' ? '#6b7280' : '#8B1538' }}
                >
                  {badgeLabel}
                </span>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      i === activeImage ? 'border-[#8B1538]' : 'border-transparent'
                    }`}
                  >
                    <img src={url} alt={`${title} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
              <p className="text-2xl font-bold mt-3" style={{ color: '#8B1538' }}>
                €{price.toFixed(2)}
              </p>
            </div>

            {description && (
              <p className="text-gray-600 leading-relaxed">{description}</p>
            )}

            <button
              onClick={handleAddToCart}
              disabled={status === 'out-of-stock'}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#8B1538' }}
            >
              <ShoppingCart className="w-4 h-4" />
              {status === 'out-of-stock' ? 'Out of Stock' : status === 'pre-order' ? 'Pre-order' : 'Add to Cart'}
            </button>

            {/* Features */}
            {features.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Features</h3>
                <ul className="space-y-2">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#8B1538' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ingredients */}
            {ingredients.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Ingredients</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {ingredients.join(', ')}
                </p>
              </div>
            )}

            {/* Nutrition Facts */}
            {nutritionFacts.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Nutrition Facts</h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {nutritionFacts.map((n, i) => (
                    <div
                      key={i}
                      className={`flex justify-between px-4 py-2.5 text-sm ${
                        i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <span className="text-gray-600">{n.label}</span>
                      <span className="font-medium text-gray-900">{n.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
