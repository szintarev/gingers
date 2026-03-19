'use client'

import React from 'react'
import type { Page } from '@/payload-types'
import { motion } from 'motion/react'
import { ArrowRight, Play, Award, Leaf, Heart } from 'lucide-react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Award,
  Leaf,
  Heart,
}

export const HighImpactHero: React.FC<Page['hero']> = ({
  title,
  description,
  media,
  links,
  features,
}) => {
  const heroTitle = title || 'Premium Ginger Products'
  const heroDesc = description || 'Experience the pure, natural taste of our handcrafted ginger products'

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-theme="dark">
      <div className="absolute inset-0 z-0 bg-gray-900">
        {media && typeof media === 'object' && media !== null && (
          <Media
            resource={media}
            fill
            imgClassName="object-cover object-center opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] pb-6 font-bold">
                  {heroTitle}
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-200 leading-relaxed max-w-xl"
              >
                {heroDesc}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                {(links || []).map((buttonObj, i) => {
                  const { link } = buttonObj
                  if (!link) return null

                  const isOutline = link.appearance === 'outline'

                  return (
                    <CMSLink
                      key={i}
                      {...link}
                      className={
                        isOutline
                          ? 'border-2 border-[#8B1538] text-white hover:bg-[#8B1538] hover:text-white px-8 py-4 text-base rounded-full inline-flex items-center justify-center transition-all'
                          : 'bg-[#8B1538] hover:bg-[#A91D3A] text-white px-8 py-4 text-base transition-all duration-300 group rounded-full inline-flex items-center justify-center'
                      }
                    >
                      {isOutline && <Play className="w-5 h-5 pr-2" />}
                      {link.label}
                      {!isOutline && (
                        <ArrowRight className="w-5 h-5 pl-2 group-hover:translate-x-1 transition-transform" />
                      )}
                    </CMSLink>
                  )
                })}
              </motion.div>

              {features && features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-8 pt-8 border-t border-[#8B1538]/20"
                >
                  {features.map((feature, i) => {
                    const Icon = feature.icon ? iconMap[feature.icon] : null

                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#8B1538]/20 flex items-center justify-center">
                          {Icon && <Icon className="w-6 h-6 text-[#8B1538]" />}
                        </div>
                        <div>
                          <div className="text-white font-medium">{feature.title}</div>
                          {feature.subtitle && (
                            <div className="text-sm text-gray-300">{feature.subtitle}</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 w-full overflow-hidden leading-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full relative block"
          style={{ width: 'calc(100% + 1.3px)', height: '120px' }}
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  )
}
