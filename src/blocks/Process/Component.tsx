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
    <section
      className="parallax-section relative py-32 overflow-hidden -mt-1"
      style={{ minHeight: '600px' }}
    >
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute inset-[-20%] z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
      <div className="absolute top-0 left-0 right-0 z-[3] leading-none">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0 0L48 8C96 16 192 32 288 38C384 44 480 40 576 36C672 32 768 28 864 30C960 32 1056 40 1152 42C1248 44 1344 40 1392 38L1440 36V0H1392C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0H0Z" fill="white"/>
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-[4] pt-16">
        <div className="text-center pb-20">
          <div className="inline-flex items-center gap-3 pb-5">
            <div className="h-px w-16 bg-white/40" />
            <div className="text-white/70 uppercase tracking-[0.2em] text-xs bracket-deco">
              {processLabel || 'OUR PROCESS'}
            </div>
            <div className="h-px w-16 bg-white/40" />
          </div>
          <h2 className="text-4xl md:text-6xl text-white pb-6 leading-tight">
            {title}
          </h2>
          <p className="text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(steps || []).map((step: ProcessBlockProps['steps'][0], index: number) => {
              const Icon = step.icon ? iconMap[step.icon] : null
              return (
                <div key={index} className="relative group">
                  <div
                    className="step-card glass-card rounded-2xl p-6 text-center h-full"
                    data-step={step.stepNumber}
                  >
                    <div className="relative inline-flex pb-6">
                      <div className="ink-hover w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-300">
                        {Icon && <Icon className="w-9 h-9 text-white" />}
                      </div>
                    </div>
                    <h3 className="text-lg text-white pb-3 group-hover:text-[#d4a574] transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-white/55 text-sm leading-relaxed group-hover:text-white/75 transition-colors duration-300">
                      {step.description}
                    </p>
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#d4a574] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-[3]">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L48 72C96 64 192 48 288 42C384 36 480 40 576 44C672 48 768 52 864 50C960 48 1056 40 1152 38C1248 36 1344 40 1392 42L1440 44V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}
