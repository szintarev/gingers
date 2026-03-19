import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import type { Product } from '@/payload-types'

async function fetchProducts(locale: string): Promise<Product[]> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 100,
    pagination: false,
    overrideAccess: false,
    locale: locale as any,
  })

  return result.docs
}

async function fetchProductBySlug(slug: string, locale: string): Promise<Product | null> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 1,
    pagination: false,
    overrideAccess: false,
    locale: locale as any,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] ?? null
}

export const getCachedProducts = (locale = 'en') =>
  unstable_cache(
    () => fetchProducts(locale),
    ['products', locale],
    { tags: ['products'], revalidate: 3600 },
  )

export const getCachedProduct = (slug: string, locale = 'en') =>
  unstable_cache(
    () => fetchProductBySlug(slug, locale),
    [`products_${slug}`, locale],
    { tags: [`products_${slug}`, 'products'], revalidate: 3600 },
  )
