/**
 * Processes media resource URL to ensure proper formatting.
 *
 * Returns a relative path (e.g. `/api/media/file/img.jpg`) when the URL points to
 * the same server (relative paths or localhost absolute URLs). This makes images work
 * on any domain — localhost, Vercel, custom domain — without hardcoding an origin.
 *
 * External CDN/R2 URLs are returned as-is (absolute), which requires a matching
 * entry in next.config.js `images.remotePatterns`.
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  const qs = cacheTag ? `?${encodeURIComponent(cacheTag)}` : ''

  // Already relative — use as-is so the browser resolves against its current origin
  if (url.startsWith('/')) {
    return `${url}${qs}`
  }

  // Absolute localhost URL (uploaded locally) — strip the origin to make it relative
  // so it works on any production domain without NEXT_PUBLIC_SERVER_URL needing to match
  const localhostMatch = url.match(/^https?:\/\/localhost(?::\d+)?(\/.*)?$/)
  if (localhostMatch) {
    const path = localhostMatch[1] ?? '/'
    return `${path}${qs}`
  }

  // External absolute URL (direct R2 / CDN) — return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return `${url}${qs}`
  }

  // Bare path without leading slash — normalise it
  return `/${url}${qs}`
}
