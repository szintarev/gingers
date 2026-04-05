'use client'

import React, { createContext, use, useState, useEffect, useCallback } from 'react'
import { translations } from './translations'

/*==================================================================
    TYPES
==================================================================*/
export type Language = 'en' | 'sr' | 'hu' | 'ru'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

/*==================================================================
    CONTEXT
==================================================================*/
const LanguageContext = createContext<LanguageContextValue | null>(null)

/*==================================================================
    PROVIDER
==================================================================*/
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('sr')

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gingers_language') as Language | null
      if (stored && (Object.keys(translations) as Language[]).includes(stored)) {
        setLanguageState(stored)
      }
    } catch {}
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    try { localStorage.setItem('gingers_language', lang) } catch {}
  }, [])

  // Falls back to English if key is missing in the selected language
  const t = useCallback((key: string): string => {
    return translations[language][key] ?? translations['en'][key] ?? key
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

/*==================================================================
    HOOK
==================================================================*/
export function useLanguage(): LanguageContextValue {
  const ctx = use(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
