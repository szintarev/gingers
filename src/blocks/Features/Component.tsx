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
    <section className="pt-24 pb-24 bg-gradient-to-b from-[#6B0F2B] via-[#8B1538] to-[#6B0F2B] relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 pb-4">
            <div className="h-px w-12 bg-white/50" />
            <div className="text-white/70 uppercase tracking-wider text-sm">
              {subtitle}
            </div>
            <div className="h-px w-12 bg-white/50" />
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
                <div className="relative bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300 h-full">
                  <div className="pb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
