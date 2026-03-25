import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { getCachedProducts, getCachedProduct } from '@/utilities/getProducts'
import { SingleProductDetail } from '@/blocks/SingleProduct/SingleProductDetail'

const VALID_LOCALES = ['en', 'sr', 'hu', 'ru'] as const
type Locale = (typeof VALID_LOCALES)[number]

function resolveLocale(raw: string | undefined): Locale {
  return VALID_LOCALES.includes(raw as Locale) ? (raw as Locale) : 'en'
}

type Args = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ locale?: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    pagination: false,
    overrideAccess: false,
    select: { slug: true },
  })

  return products.docs
    .filter((p) => p.slug)
    .map(({ slug }) => ({ slug }))
}

export default async function ProductPage({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { slug } = await paramsPromise
  const { locale: localeParam } = await searchParamsPromise
  const locale = resolveLocale(localeParam)

  const product = await getCachedProduct(slug, locale)()

  if (!product) notFound()

  const images = (product.images ?? []).map((item) => {
    const img = item.image
    return typeof img === 'object' && img !== null && 'url' in img ? (img.url ?? null) : null
  }).filter(Boolean) as string[]

  return (
    <article>
      <SingleProductDetail
        id={product.id}
        title={product.title}
        price={product.price}
        description={product.description ?? ''}
        status={product.status}
        slug={product.slug ?? ''}
        images={images}
        features={(product.features ?? []).map((f) => f.feature).filter(Boolean) as string[]}
        ingredients={(product.ingredients ?? []).map((i) => i.ingredient).filter(Boolean) as string[]}
        nutritionFacts={(product.nutritionFacts ?? []).map((n) => ({
          label: n.label ?? '',
          value: n.value ?? '',
        }))}
      />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise, searchParams: searchParamsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const { locale: localeParam } = await searchParamsPromise
  const locale = resolveLocale(localeParam)

  const product = await getCachedProduct(slug, locale)()

  if (!product) return {}

  const imageObj = product.images?.[0]?.image
  const imageUrl = typeof imageObj === 'object' && imageObj !== null && 'url' in imageObj
    ? imageObj.url
    : undefined

  return {
    title: product.title,
    description: product.description ?? undefined,
    openGraph: {
      title: product.title,
      description: product.description ?? undefined,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  }
}
