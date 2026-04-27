'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { FileText, ExternalLink } from 'lucide-react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'

const STICKER_URLS = [
  '/Stiker1_no_margins.pdf',
  '/Stiker2_no_margins.pdf',
  '/Stiker3_no_margins.pdf',
  '/Stiker4_no_margins.pdf',
  '/Stiker5_no_margins.pdf',
  '/Stiker6_no_margins.pdf',
  '/Stiker7_no_margins.pdf',
  '/Stiker8_no_margins.pdf',
]

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&'

function scrambleTo(el: HTMLElement, finalText: string, duration = 0.7, onComplete?: () => void) {
  const frames = Math.round(duration * 60)
  let frame = 0
  const tick = () => {
    frame++
    const progress = frame / frames
    el.textContent = finalText
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' '
        if (i / finalText.length < progress) return char
        return CHARS[Math.floor(Math.random() * CHARS.length)]!
      })
      .join('')
    if (frame < frames) requestAnimationFrame(tick)
    else { el.textContent = finalText; onComplete?.() }
  }
  requestAnimationFrame(tick)
}

function FileCard({ name, url, viewPdfLabel }: { name: string; url: string; viewPdfLabel: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.11)'
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.22)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.10)'
      }}
    >
      <FileText className="w-8 h-8" style={{ color: 'rgba(255,255,255,0.45)' }} />
      <span className="text-xs text-center leading-snug" style={{ color: 'rgba(255,255,255,0.65)' }}>
        {name}
      </span>
      <span
        className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full"
        style={{
          background: 'rgba(139,21,56,0.55)',
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        <ExternalLink className="w-3 h-3" />
        {viewPdfLabel}
      </span>
    </a>
  )
}

export const WelcomePage: React.FC = () => {
  const { t } = useLanguage()

  const rootRef     = useRef<HTMLDivElement>(null)
  const logoRef     = useRef<HTMLDivElement>(null)
  const welcomeRef  = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const line1Ref    = useRef<HTMLDivElement>(null)
  const line2Ref    = useRef<HTMLDivElement>(null)
  const switcherRef = useRef<HTMLDivElement>(null)

  const lastHeading = useRef('')
  const scrambleHeading = useCallback(() => {
    if (!welcomeRef.current) return
    const heading = t('welcomeHeading').toUpperCase()
    if (heading === lastHeading.current) return
    lastHeading.current = heading
    scrambleTo(welcomeRef.current, heading, 0.55)
  }, [t])

  useEffect(() => { scrambleHeading() }, [scrambleHeading])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(logoRef.current,     { opacity: 0, scale: 0.78, y: 18 })
      gsap.set(welcomeRef.current,  { opacity: 0 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 10 })
      gsap.set([line1Ref.current, line2Ref.current], { scaleX: 0, opacity: 0 })
      gsap.set(switcherRef.current, { opacity: 0, y: -10 })

      const tl = gsap.timeline({ delay: 0.1 })

      tl.to(logoRef.current, {
          opacity: 1, scale: 1, y: 0,
          duration: 0.4,
          ease: 'back.out(1.6)',
        })
        .to(switcherRef.current, {
          opacity: 1, y: 0,
          duration: 0.3,
          ease: 'power3.out',
        }, '-=0.2')
        .to([line1Ref.current, line2Ref.current], {
          scaleX: 1, opacity: 1,
          duration: 0.32,
          stagger: 0.06,
          ease: 'power2.inOut',
        }, '-=0.2')
        .to(welcomeRef.current, {
          opacity: 1, duration: 0.15, ease: 'none',
          onComplete: scrambleHeading,
        }, '-=0.1')
        .to(subtitleRef.current, {
          opacity: 1, y: 0, duration: 0.3, ease: 'power3.out',
        }, '-=0.05')

      // Logo gentle float
      gsap.to(logoRef.current, {
        y: -10, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.8,
      })
    }, rootRef)

    return () => ctx.revert()
  }, [scrambleHeading])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10002] flex flex-col items-center overflow-y-auto"
      style={{ background: 'linear-gradient(160deg, #3D0817 0%, #6B0F2B 55%, #3D0817 100%)' }}
    >
      {/* Subtle centre glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 50% 45%, rgba(255,100,120,0.10) 0%, transparent 65%)',
        }}
      />

      {/* Language switcher */}
      <div ref={switcherRef} className="absolute top-6 right-6 z-10">
        <LanguageSwitcher dark />
      </div>

      {/* Centre content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-6">
        <div ref={logoRef} className="mb-10">
          <img
            src="/gnglogo.svg"
            alt="Gingers"
            className="w-[640px] h-auto max-w-[80vw]"
            style={{ filter: 'drop-shadow(0 0 32px rgba(139,21,56,0.45))' }}
          />
        </div>

        <div className="flex items-center gap-5 mb-4">
          <div
            ref={line1Ref}
            className="w-14 h-px origin-right"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,21,56,0.7))' }}
          />
          <h1
            ref={welcomeRef}
            className="text-sm font-semibold tracking-[0.45em]"
            style={{ color: 'rgba(255,255,255,0.55)', minWidth: '140px' }}
          >
            {t('welcomeHeading').toUpperCase()}
          </h1>
          <div
            ref={line2Ref}
            className="w-14 h-px origin-left"
            style={{ background: 'linear-gradient(90deg, rgba(139,21,56,0.7), transparent)' }}
          />
        </div>

        <p
          ref={subtitleRef}
          className="text-sm max-w-sm leading-relaxed mb-6"
          style={{ color: 'rgba(255,255,255,0.28)' }}
        >
          {t('welcomeSubtitle')}
        </p>

        <div
          className="px-8 py-3.5 rounded-full text-sm tracking-widest uppercase font-semibold"
          style={{
            background: 'rgba(139,21,56,0.25)',
            border: '1px solid rgba(139,21,56,0.6)',
            color: 'rgba(255,255,255,0.75)',
            boxShadow: '0 0 20px rgba(139,21,56,0.2)',
          }}
        >
          Currently in development
        </div>
      </div>

      {/* Files section */}
      <div className="relative z-10 w-full max-w-5xl px-6 pb-16">

        {/* Stickers */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {t('stickers')}
            </span>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.12)' }} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STICKER_URLS.map((url, i) => (
              <FileCard
                key={url}
                name={`${t('sticker')} ${i + 1}`}
                url={url}
                viewPdfLabel={t('viewPdf')}
              />
            ))}
          </div>
        </div>

        {/* Flyers */}
        <div>
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {t('flyers')}
            </span>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.12)' }} />
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <FileCard name={t('flyerFront')} url="/Flajer_Prednja_cut_marks.pdf" viewPdfLabel={t('viewPdf')} />
            <FileCard name={t('flyerBack')}  url="/Flajer_Zadnja_cut_marks.pdf"  viewPdfLabel={t('viewPdf')} />
          </div>
        </div>

      </div>
    </div>
  )
}
