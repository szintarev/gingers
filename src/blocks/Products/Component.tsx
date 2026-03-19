import React from 'react'
import Image from 'next/image'
import type { ProductsBlock as ProductsBlockProps } from '@/payload-types'
import { getCachedProducts } from '@/utilities/getProducts'

export const ProductsBlockComponent: React.FC<ProductsBlockProps & { locale?: string }> = async ({
  label,
  title,
  description,
  locale = 'en',
}) => {
  const products = await getCachedProducts(locale)()

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center pb-16">
          <div className="inline-flex items-center gap-3 pb-5">
            <div className="h-px w-16 bg-[#8B1538]/30" />
            <span className="text-[#8B1538] uppercase tracking-[0.2em] text-xs font-medium">
              {label || 'OUR PRODUCTS'}
            </span>
            <div className="h-px w-16 bg-[#8B1538]/30" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 pb-5 leading-tight">{title}</h2>
          {description && (
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">{description}</p>
          )}
        </div>

        {/* Products grid */}
        {products.length === 0 ? (
          <p className="text-center text-gray-400">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const firstImage =
                product.images?.[0]?.image &&
                typeof product.images[0].image === 'object'
                  ? product.images[0].image
                  : null

              const isOutOfStock = product.status === 'out-of-stock'

              return (
                <div
                  key={product.id}
                  className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    {firstImage?.url ? (
                      <Image
                        src={firstImage.url}
                        alt={firstImage.alt || product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {/* Status badge */}
                    {product.status !== 'in-stock' && (
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${
                            isOutOfStock
                              ? 'bg-gray-900/70 text-white'
                              : 'bg-[#8B1538]/80 text-white'
                          }`}
                        >
                          {isOutOfStock ? 'Out of Stock' : 'Pre-order'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-gray-900 font-semibold text-lg pb-2 group-hover:text-[#8B1538] transition-colors duration-200">
                      {product.title}
                    </h3>
                    {product.description && (
                      <p className="text-gray-500 text-sm leading-relaxed pb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-[#8B1538] font-bold text-xl">
                        ${product.price.toFixed(2)}
                      </span>
                      <a
                        href={`/products/${product.slug}`}
                        className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors duration-200 ${
                          isOutOfStock
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-[#8B1538] text-white hover:bg-[#6B0F2B]'
                        }`}
                      >
                        {isOutOfStock ? 'Unavailable' : 'View Product'}
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
