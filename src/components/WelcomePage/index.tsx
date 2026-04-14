'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'

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
      className="fixed inset-0 z-[10002] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0a0306 0%, #180610 55%, #0a0306 100%)' }}
    >
      {/* Subtle centre glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 50% 45%, rgba(139,21,56,0.14) 0%, transparent 65%)',
        }}
      />

      {/* Language switcher */}
      <div ref={switcherRef} className="absolute top-6 right-6 z-10">
        <LanguageSwitcher dark />
      </div>

      {/* Centre content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
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
    </div>
  )
}
