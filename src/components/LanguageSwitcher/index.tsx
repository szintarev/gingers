'use client'

import React, { useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useLanguage, type Language } from '@/contexts/LanguageContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LanguageOption {
  code: Language
  label: string
  flagUrl: string
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', flagUrl: 'https://flagcdn.com/w40/gb.png' },
  { code: 'sr', label: 'Српски', flagUrl: 'https://flagcdn.com/w40/rs.png' },
  { code: 'hu', label: 'Magyar', flagUrl: 'https://flagcdn.com/w40/hu.png' },
  { code: 'ru', label: 'Русский', flagUrl: 'https://flagcdn.com/w40/ru.png' },
]

const VALID_LOCALES = LANGUAGES.map((l) => l.code)

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const currentLanguage = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]!

  // On mount, sync context from URL so a direct link with ?locale=sr works
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlLocale = params.get('locale') as Language | null
    if (urlLocale && VALID_LOCALES.includes(urlLocale) && urlLocale !== language) {
      setLanguage(urlLocale)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(lang: Language) {
    setLanguage(lang)
    // Update the URL so the server component re-fetches page content in the new locale
    const params = new URLSearchParams(window.location.search)
    params.set('locale', lang)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 backdrop-blur-sm rounded-full px-3 py-2 border transition-all duration-300 min-w-[120px] h-[36px] justify-center"
          style={
            dark
              ? {
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(139,21,56,0.4)',
                  color: 'rgba(255,255,255,0.7)',
                }
              : undefined
          }
        >
          <img
            src={currentLanguage.flagUrl}
            alt={currentLanguage.label}
            className="w-5 h-4 object-cover rounded flex-shrink-0"
          />
          <div
            className={`text-sm truncate min-w-0 ${dark ? '' : 'text-gray-700'}`}
            style={dark ? { color: 'rgba(255,255,255,0.7)' } : undefined}
          >
            {currentLanguage.label}
          </div>
          <ChevronDown
            className="w-4 h-4 flex-shrink-0"
            style={dark ? { color: 'rgba(139,21,56,0.8)' } : { color: '#8B1538' }}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className={`min-w-[140px] ${dark ? 'z-[10003]' : ''}`}
        style={
          dark
            ? {
                background: 'rgba(20,6,12,0.95)',
                borderColor: 'rgba(139,21,56,0.35)',
                backdropFilter: 'blur(12px)',
              }
            : { background: 'white', borderColor: '#e5e7eb' }
        }
        sideOffset={5}
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className="flex items-center gap-2 cursor-pointer"
            style={
              dark
                ? {
                    color:
                      language === lang.code ? '#c04070' : 'rgba(255,255,255,0.6)',
                    background:
                      language === lang.code ? 'rgba(139,21,56,0.15)' : 'transparent',
                  }
                : {
                    color: language === lang.code ? '#8B1538' : '#374151',
                    background: language === lang.code ? 'rgba(139,21,56,0.08)' : 'transparent',
                  }
            }
          >
            <img
              src={lang.flagUrl}
              alt={lang.label}
              className="w-5 h-4 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1">{lang.label}</div>
            {language === lang.code && (
              <div className="ml-auto" style={{ color: dark ? '#c04070' : '#8B1538' }}>
                ✓
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
