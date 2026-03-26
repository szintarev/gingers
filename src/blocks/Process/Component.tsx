import React from 'react'

import type { ProcessBlock as ProcessBlockProps } from '@/payload-types'
import { Sprout, FlaskConical, Package, Star } from 'lucide-react'

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Sprout,
  FlaskConical,
  Package,
  Star,
}

export const ProcessBlock: React.FC<ProcessBlockProps> = ({
  processLabel,
  title,
  description,
  backgroundImage,
  steps,
}) => {
  const bgUrl = typeof backgroundImage === 'object' && backgroundImage?.url ? backgroundImage.url : ''

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#6B0F2B' }}>

      {/* Background image */}
      {bgUrl && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2,
          }}
        />
      )}

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0 leading-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: '80px' }}>
          <path d="M0 0L48 8C96 16 192 32 288 38C384 44 480 40 576 36C672 32 768 28 864 30C960 32 1056 40 1152 42C1248 44 1344 40 1392 38L1440 36V0H0Z" fill="white" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-28 pb-28">

        {/* Header */}
        <div className="text-center mb-16">
          {processLabel && (
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="h-px w-12 bg-white/30" />
              <span className="text-white/60 uppercase tracking-widest text-xs font-medium">{processLabel}</span>
              <div className="h-px w-12 bg-white/30" />
            </div>
          )}
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4 leading-tight">{title}</h2>
          {description && (
            <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">{description}</p>
          )}
        </div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {(steps || []).map((step, index) => {
            const Icon = step.icon ? iconMap[step.icon] : null
            return (
              <div key={index} className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 hover:border-white/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-5 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-300">
                  {Icon && <Icon className="w-8 h-8 text-white" />}
                </div>
                <h3 className="text-white font-medium text-base mb-2">{step.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 leading-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: '80px', marginBottom: '-2px' }}>
          <path d="M0 80L48 72C96 64 192 48 288 42C384 36 480 40 576 44C672 48 768 52 864 50C960 48 1056 40 1152 38C1248 36 1344 40 1392 42L1440 44V80H0Z" fill="white" />
        </svg>
      </div>

    </section>
  )
}
