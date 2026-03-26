'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react'
import { ShoppingCart, Menu, X, Search, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Header } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface HeaderClientProps {
  data: Header
}

interface SearchResult {
  id: number
  title: string
  price: number
  slug: string
  images?: { image?: { url?: string } }[]
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const navItems = data?.navItems || []
  const { getTotalItems, openCart } = useCart()
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setIsScrolled(y > 50))

  const headerBg = 'bg-white/95 backdrop-blur-sm border-b border-gray-200'
  const interactiveItemClass = 'text-gray-700 hover:text-[#8B1538] hover:bg-gray-100'

  useEffect(() => {
    if (!searchQuery.trim()) { setResults([]); return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/products?where[title][like]=${encodeURIComponent(searchQuery)}&depth=1&limit=6`)
        const data = await res.json()
        setResults(data.docs ?? [])
      } catch {
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [searchQuery])

  function closeSearch() {
    setIsSearchOpen(false)
    setSearchQuery('')
    setResults([])
  }

  return (
    <>
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[10000] bg-white flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-gray-100 flex-shrink-0">
              <span className="text-lg tracking-tight font-medium text-gray-900">{t('title')}</span>
              <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-1">
              {navItems.map(({ link }, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05, duration: 0.25 }} onClick={() => setIsMenuOpen(false)}>
                  <CMSLink {...link} className="block text-2xl font-light text-gray-800 hover:text-[#8B1538] transition-colors py-3 border-b border-gray-100" />
                </motion.div>
              ))}
            </nav>
            <div className="px-6 py-6 border-t border-gray-100 flex-shrink-0 flex items-center justify-between">
              <LanguageSwitcher />
              <button onClick={() => { openCart(); setIsMenuOpen(false) }} className="relative flex items-center gap-2 text-sm text-gray-600 hover:text-[#8B1538] transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center bg-[#8B1538] text-white text-xs rounded-full">{getTotalItems()}</span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            key="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10001] flex items-start justify-center pt-24 px-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={closeSearch}
          >
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Input row */}
              <div className="flex items-center gap-3 px-5 py-4 border-b-2 border-[#8B1538]">
                <Search className="w-5 h-5 text-[#8B1538] flex-shrink-0" />
                <input
                  ref={searchRef}
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
                  placeholder={t('products') + '...'}
                  className="flex-1 text-gray-900 text-base outline-none placeholder:text-gray-400 bg-transparent"
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setResults([]); searchRef.current?.focus() }} className="text-gray-400 hover:text-gray-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button onClick={closeSearch} className="ml-1 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors border border-gray-200 rounded px-2 py-1">
                  ESC
                </button>
              </div>

              {/* Results */}
              {searchQuery.trim() && (
                <div className="max-h-80 overflow-y-auto">
                  {isSearching && (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-5 h-5 border-2 border-[#8B1538] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {!isSearching && results.length === 0 && (
                    <div className="py-10 text-center text-sm text-gray-400">
                      No products found for &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                  {!isSearching && results.length > 0 && (
                    <ul className="divide-y divide-gray-50">
                      {results.map((product) => {
                        const imgUrl = product.images?.[0]?.image?.url
                        return (
                          <li key={product.id}>
                            <Link
                              href={`/products/${product.slug}`}
                              onClick={closeSearch}
                              className="flex items-center gap-4 px-5 py-3 hover:bg-[#8B1538]/5 transition-colors group"
                            >
                              {imgUrl
                                ? <img src={imgUrl} alt={product.title} className="w-12 h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0" />
                                : <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0" />
                              }
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#8B1538] transition-colors">{product.title}</p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-sm font-semibold text-[#8B1538]">€{product.price?.toFixed(2)}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#8B1538] transition-colors" />
                              </div>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )}

              {/* Footer hint */}
              {!searchQuery && (
                <div className="px-5 py-4 text-xs text-gray-400">
                  Start typing to search products...
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header
        style={{ position: 'fixed', top: 'var(--admin-bar-height, 0px)', left: 0, right: 0, zIndex: 9999 }}
        className={`transition-all duration-300 ${headerBg}`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-20">
            <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
              <div className="text-lg tracking-tight font-medium whitespace-nowrap text-gray-900">{t('title')}</div>
            </motion.div>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(({ link }, i) => (
                <CMSLink key={i} {...link} className={`transition-colors duration-300 px-4 py-2 rounded-lg whitespace-nowrap text-sm ${interactiveItemClass}`} />
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden md:block"><LanguageSwitcher /></div>

              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className={`hidden md:flex items-center justify-center w-9 h-9 rounded-md transition-colors ${interactiveItemClass}`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={openCart}
                className={`relative flex items-center justify-center w-9 h-9 rounded-md transition-colors ${interactiveItemClass}`}
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#8B1538] text-white text-xs rounded-full">{getTotalItems()}</div>
                )}
              </motion.button>

              <button
                className={`lg:hidden flex items-center justify-center w-9 h-9 rounded-md transition-colors ${interactiveItemClass}`}
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
