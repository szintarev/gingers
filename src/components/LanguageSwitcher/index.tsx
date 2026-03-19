'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'
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

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const currentLanguage = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]!

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 border border-gray-200 hover:border-[#8B1538] transition-all duration-300 min-w-[120px] h-[36px] justify-center"
        >
          <img
            src={currentLanguage.flagUrl}
            alt={currentLanguage.label}
            className="w-5 h-4 object-cover rounded flex-shrink-0"
          />
          <div className="text-sm text-gray-700 truncate min-w-0">{currentLanguage.label}</div>
          <ChevronDown className="w-4 h-4 text-[#8B1538] flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="bg-white border-gray-200 min-w-[140px]"
        sideOffset={5}
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              language === lang.code
                ? 'bg-[#8B1538]/10 text-[#8B1538]'
                : 'text-gray-700 hover:text-[#8B1538] hover:bg-gray-50'
            }`}
          >
            <img
              src={lang.flagUrl}
              alt={lang.label}
              className="w-5 h-4 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1">{lang.label}</div>
            {language === lang.code && <div className="ml-auto text-[#8B1538]">✓</div>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
