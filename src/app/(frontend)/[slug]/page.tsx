import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { WelcomePage } from '@/components/WelcomePage'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

const VALID_LOCALES = ['en', 'sr', 'hu', 'ru'] as const
type Locale = (typeof VALID_LOCALES)[number]

function resolveLocale(raw: string | undefined): Locale {
  return VALID_LOCALES.includes(raw as Locale) ? (raw as Locale) : 'en'
}

type Args = {
  params: Promise<{
    slug?: string
  }>
  searchParams: Promise<{
    locale?: string
  }>
}

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const { locale: localeParam } = await searchParamsPromise
  const locale = resolveLocale(localeParam)
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  const page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({
    slug: decodedSlug,
    locale,
  })

  // Show the welcome page when no home page has been created yet in the CMS
  if (!page && slug === 'home') {
    return <WelcomePage />
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article>
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise, searchParams: searchParamsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const { locale: localeParam } = await searchParamsPromise
  const locale = resolveLocale(localeParam)
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
    locale,
  })

  return generateMeta({ doc: page })
}

async function fetchPageBySlug(slug: string, draft: boolean, locale: Locale) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    locale,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] ?? null
}

// Persistent cache with tag-based revalidation — locale is part of the key
const getCachedPageBySlug = (slug: string, locale: Locale) =>
  unstable_cache(
    () => fetchPageBySlug(slug, false, locale),
    [`page_${slug}_${locale}`],
    { tags: [`pages_${slug}`, 'pages'], revalidate: 3600 },
  )

// Request-level deduplication so generateMetadata and Page don't double-fetch
const queryPageBySlug = cache(async ({ slug, locale }: { slug: string; locale: Locale }) => {
  const { isEnabled: draft } = await draftMode()

  // Draft mode bypasses the persistent cache so editors always see the latest content
  if (draft) return fetchPageBySlug(slug, true, locale)

  return getCachedPageBySlug(slug, locale)()
})
