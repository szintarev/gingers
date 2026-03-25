import React from 'react'
import type { SingleProductBlock as SingleProductBlockProps } from '@/payload-types'
import { getCachedProductById } from '@/utilities/getProducts'
import { SingleProductDetail } from './SingleProductDetail'

export const SingleProductBlockComponent: React.FC<
  SingleProductBlockProps & { locale?: string }
> = async ({ product, locale = 'en' }) => {
  const productId = typeof product === 'object' && product !== null ? product.id : product

  if (!productId) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-400">
          No product selected.
        </div>
      </section>
    )
  }

  const data = await getCachedProductById(productId, locale)()

  if (!data) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-400">
          Product not found.
        </div>
      </section>
    )
  }

  const images = (data.images ?? []).map((item) => {
    const img = item.image
    return typeof img === 'object' && img !== null && 'url' in img
      ? (img.url ?? null)
      : null
  }).filter(Boolean) as string[]

  return (
    <SingleProductDetail
      id={data.id}
      title={data.title}
      price={data.price}
      description={data.description ?? ''}
      status={data.status}
      slug={data.slug ?? ''}
      images={images}
      features={(data.features ?? []).map((f) => f.feature).filter(Boolean) as string[]}
      ingredients={(data.ingredients ?? []).map((i) => i.ingredient).filter(Boolean) as string[]}
      nutritionFacts={(data.nutritionFacts ?? []).map((n) => ({
        label: n.label ?? '',
        value: n.value ?? '',
      }))}
    />
  )
}
