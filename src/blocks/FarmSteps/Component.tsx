import React from 'react'
import type { FarmStepsBlock as FarmStepsBlockProps } from '@/payload-types'
import {
  Leaf,
  ShieldCheck,
  Truck,
  Award,
  Heart,
  Users,
  Sprout,
  FlaskConical,
  Package,
  Star,
} from 'lucide-react'

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Leaf,
  ShieldCheck,
  Truck,
  Award,
  Heart,
  Users,
  Sprout,
  FlaskConical,
  Package,
  Star,
}

export const FarmStepsBlock: React.FC<FarmStepsBlockProps> = ({ label, title, description, features }) => {
  return (
    <section className="relative py-24 overflow-hidden" style={{ backgroundColor: '#8B1538' }}>
      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center pb-16">
          <div className="inline-flex items-center gap-3 pb-5">
            <div className="h-px w-16 bg-white/40" />
            <span className="text-white/70 uppercase tracking-[0.2em] text-xs">
              {label || 'WHY CHOOSE US'}
            </span>
            <div className="h-px w-16 bg-white/40" />
          </div>
          <h2 className="text-4xl md:text-5xl text-white font-bold pb-5 leading-tight">
            {title}
          </h2>
          {description && (
            <p className="text-white/65 text-lg max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {(features || []).map((feature, index) => {
            const Icon = feature.icon ? iconMap[feature.icon] : null
            return (
              <div
                key={index}
                className="rounded-2xl p-8 group transition-all duration-300 hover:scale-[1.02]"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 transition-colors duration-300 group-hover:bg-white/20"
                  style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                >
                  {Icon && <Icon className="w-6 h-6 text-white" />}
                </div>
                <h3 className="text-white text-xl font-semibold pb-3">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 80L48 72C96 64 192 48 288 42C384 36 480 40 576 44C672 48 768 52 864 50C960 48 1056 40 1152 38C1248 36 1344 40 1392 42L1440 44V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
