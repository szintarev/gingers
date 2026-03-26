'use client'

import React, { useState } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react'
import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import type { Header } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { CartDrawer } from '@/components/Cart'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const navItems = data?.navItems || []
  const { getTotalItems, openCart } = useCart()
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setIsScrolled(y > 50))

  const headerBg = 'bg-white/95 backdrop-blur-sm border-b border-gray-200'
  const interactiveItemClass = 'text-gray-700 hover:text-[#8B1538] hover:bg-gray-100'

  return (
    <>
      <CartDrawer />

      {/* Full-screen mobile menu overlay */}
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
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-gray-100 flex-shrink-0">
              <span className="text-lg tracking-tight font-medium text-gray-900">{t('title')}</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-1">
              {navItems.map(({ link }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.25 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CMSLink
                    {...link}
                    className="block text-2xl font-light text-gray-800 hover:text-[#8B1538] transition-colors py-3 border-b border-gray-100"
                  />
                </motion.div>
              ))}
            </nav>

            {/* Bottom bar */}
            <div className="px-6 py-6 border-t border-gray-100 flex-shrink-0 flex items-center justify-between">
              <LanguageSwitcher />
              <button
                onClick={() => { openCart(); setIsMenuOpen(false) }}
                className="relative flex items-center gap-2 text-sm text-gray-600 hover:text-[#8B1538] transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center bg-[#8B1538] text-white text-xs rounded-full">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            key="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[2000] flex items-start justify-center pt-32 px-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => { setIsSearchOpen(false); setSearchQuery('') }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && (setIsSearchOpen(false), setSearchQuery(''))}
                  placeholder="Search products..."
                  className="flex-1 text-gray-800 text-base outline-none placeholder:text-gray-400"
                />
                <button
                  onClick={() => { setIsSearchOpen(false); setSearchQuery('') }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        style={{ position: 'fixed', top: 'var(--admin-bar-height, 0px)', left: 0, right: 0, zIndex: 9999 }}
        className={`transition-all duration-300 ${headerBg}`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-20">

            <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
              <div className="text-lg tracking-tight font-medium whitespace-nowrap text-gray-900">
                {t('title')}
              </div>
            </motion.div>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  className={`transition-colors duration-300 px-4 py-2 rounded-lg whitespace-nowrap text-sm ${interactiveItemClass}`}
                />
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className={`hidden md:flex items-center justify-center w-9 h-9 rounded-md transition-colors ${interactiveItemClass}`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openCart}
                className={`relative flex items-center justify-center w-9 h-9 rounded-md transition-colors ${interactiveItemClass}`}
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#8B1538] text-white text-xs rounded-full">
                    {getTotalItems()}
                  </div>
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
