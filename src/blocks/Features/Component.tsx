import React from 'react'

import type { FeaturesBlock as FeaturesBlockProps } from '@/payload-types'
import { Leaf, Shield, Truck, Award, Heart, Users } from 'lucide-react'

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Leaf,
  Shield,
  Truck,
  Award,
  Heart,
  Users,
}

export const FeaturesBlock: React.FC<FeaturesBlockProps> = ({
  subtitle,
  title,
  description,
  features,
}) => {
  return (
    <section className="pt-24 pb-24 relative overflow-hidden" style={{ backgroundColor: '#6B0F2B' }}>
      {/* Radial glow top-center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,100,80,0.18) 0%, transparent 70%)',
        }}
      />
      {/* Radial glow bottom-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 10% 100%, rgba(255,60,60,0.12) 0%, transparent 70%)',
        }}
      />
      {/* Radial glow bottom-right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 90% 100%, rgba(180,20,60,0.15) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="pb-4">
            <div className="text-white/70 uppercase tracking-wider text-sm">
              {subtitle}
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl text-white pb-6">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {(features || []).map((feature, index) => {
            const Icon = feature.icon ? iconMap[feature.icon] : null
            return (
              <div
                key={index}
                className="group transition-transform hover:-translate-y-2 duration-300"
              >
                <div
                  className="relative p-8 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 h-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.06) 100%)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {/* Card inner glow on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,120,80,0.12) 0%, transparent 70%)',
                    }}
                  />
                  <div className="pb-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.10) 100%)',
                      }}
                    >
                      {Icon && <Icon className="w-8 h-8 text-white" />}
                    </div>
                  </div>
                  <h3 className="text-2xl text-white pb-3 group-hover:text-white/80 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/65 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
