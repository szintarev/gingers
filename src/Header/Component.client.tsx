'use client'

import React, { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { ShoppingCart, Menu, X, Heart, Search } from 'lucide-react'
import type { Header } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { CartDrawer } from '@/components/Cart'
import { useCart } from '@/contexts/CartContext'
import { useSavedItems } from '@/contexts/SavedItemsContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const navItems = data?.navItems || []
  const { getTotalItems, openCart } = useCart()
  const { savedItems } = useSavedItems()
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setIsScrolled(y > 50))

  const headerBg = isScrolled
    ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200'
    : 'bg-transparent'
  const interactiveItemClass = isScrolled
    ? 'text-gray-700 hover:text-[#8B1538] hover:bg-gray-100'
    : 'text-gray-200 hover:text-white hover:bg-white/10'

  return (
    <>
    <CartDrawer />
    <header
      style={{ position: 'fixed', top: 'var(--admin-bar-height, 0px)', left: 0, right: 0, zIndex: 50 }}
      className={`transition-all duration-300 ${headerBg}`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-20">

          <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
            <div className={`text-lg tracking-tight font-medium whitespace-nowrap ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
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
              className={`hidden md:flex items-center justify-center w-9 h-9 rounded-md transition-colors ${interactiveItemClass}`}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`hidden md:flex relative items-center justify-center w-9 h-9 rounded-md transition-colors ${interactiveItemClass}`}
              aria-label="Saved items"
            >
              <Heart className="w-5 h-5" />
              {savedItems.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#8B1538] text-white text-xs rounded-full">
                  {savedItems.length}
                </div>
              )}
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden lg:hidden"
        >
          <div className="py-4 space-y-1 bg-white rounded-b-2xl shadow-lg px-2 -mx-4 border-t border-gray-100">
            {navItems.map(({ link }, i) => (
              <div key={i} onClick={() => setIsMenuOpen(false)}>
                <CMSLink
                  {...link}
                  className="block text-gray-700 hover:text-[#8B1538] transition-colors py-2 px-4 rounded-lg hover:bg-gray-100 text-sm"
                />
              </div>
            ))}
            <div className="pt-3 pb-1 px-4">
              <LanguageSwitcher />
            </div>
          </div>
        </motion.div>
      </div>
    </header>
    </>
  )
}
