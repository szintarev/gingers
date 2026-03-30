'use client'

import React from 'react'
import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { CartProvider } from '@/contexts/CartContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { CartDrawer } from '@/components/Cart'

/*==================================================================
    PROVIDERS
    Wraps the app with all required context providers.
    CartDrawer is rendered here (not inside Header) so it can use
    createPortal to escape the header's stacking context.
==================================================================*/
export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <LanguageProvider>
          <CartProvider>
            <CartDrawer />
            {children}
          </CartProvider>
        </LanguageProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
