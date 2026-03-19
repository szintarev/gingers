'use client'

import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { CartProvider } from '@/contexts/CartContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { SavedItemsProvider } from '@/contexts/SavedItemsContext'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <LanguageProvider>
          <CartProvider>
            <SavedItemsProvider>
              {children}
            </SavedItemsProvider>
          </CartProvider>
        </LanguageProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
