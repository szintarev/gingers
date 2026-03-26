import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ProductsGridBlock as ProductsGridBlockProps } from '@/payload-types'
import { getCachedProducts } from '@/utilities/getProducts'
import { ProductCard } from './ProductCard'

export const ProductsGridBlockComponent: React.FC<ProductsGridBlockProps & { locale?: string }> = async ({
  label,
  title,
  description,
  buttonText,
  buttonLink,
  locale = 'en',
}) => {
  const products = await getCachedProducts(locale)()

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12" style={{ backgroundColor: '#8B1538', opacity: 0.3 }} />
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: '#8B1538' }}>
              {label || 'OUR PRODUCTS'}
            </span>
            <div className="h-px w-12" style={{ backgroundColor: '#8B1538', opacity: 0.3 }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title || 'Premium Collection'}
          </h2>
          {description && (
            <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => {
              const imageObj =
                product.images?.[0]?.image && typeof product.images[0].image === 'object'
                  ? product.images[0].image
                  : null
              const imageUrl = imageObj && 'url' in imageObj ? (imageObj.url ?? null) : null

              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  description={product.description ?? ''}
                  imageUrl={imageUrl}
                  status={product.status}
                  slug={product.slug ?? ''}
                />
              )
            })}
          </div>
        )}

        {buttonText && (
          <div className="flex justify-center mt-12">
            <Link
              href={buttonLink || '/products'}
              className="inline-flex items-center gap-2 bg-[#8B1538] hover:bg-[#A91D3A] text-white px-8 py-4 rounded-full text-base font-medium transition-all duration-300 group"
            >
              {buttonText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
