import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'
import type { Product } from '@/payload-types'

export const revalidateProduct: CollectionAfterChangeHook<Product> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating product: ${doc.slug}`)
    // Bust the specific product and the full product list
    revalidateTag(`products_${doc.slug}`)
    revalidateTag('products')
  }
  return doc
}

export const revalidateProductDelete: CollectionAfterDeleteHook<Product> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidateTag(`products_${doc?.slug}`)
    revalidateTag('products')
  }
  return doc
}
