import React from 'react'

import type { StatsBlock as StatsBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'

export const StatsBlock: React.FC<StatsBlockProps> = ({
  subtitle,
  title,
  description,
  stats,
  image,
  floatingQuote,
}) => {
  return (
    <section className="relative py-24 overflow-hidden bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <div className="relative">
            <div className="relative h-[500px] rounded-3xl overflow-hidden">
              {typeof image === 'object' && image !== null ? (
                <Media
                  resource={image}
                  className="w-full h-full object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-[#6B0F2B]/60 to-transparent" />
              {floatingQuote && (
                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl transition-transform hover:scale-[1.02] duration-300">
                  <p className="text-gray-700 text-sm leading-relaxed italic">
                    &ldquo;{floatingQuote.quoteText}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4">
                    <div className="w-10 h-10 rounded-full bg-[#8B1538] flex items-center justify-center text-white text-sm font-semibold">
                      {floatingQuote.authorInitials}
                    </div>
                    <div>
                      <div className="text-gray-900 text-sm font-medium">
                        {floatingQuote.authorName}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {floatingQuote.authorRole}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 pb-4">
                <div className="h-px w-12 bg-[#8B1538]" />
                <div className="text-[#8B1538] uppercase tracking-wider text-sm">
                  {subtitle || 'BY THE NUMBERS'}
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl text-gray-900 pb-4 leading-tight">
                {title}
              </h2>
              {description && (
                <p className="text-gray-600 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {(stats || []).map((stat, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-[#8B1538]/5 to-[#8B1538]/10 rounded-2xl p-6 border border-[#8B1538]/15 transition-transform hover:-translate-y-1 duration-300"
                >
                  <div className="text-4xl font-bold text-[#8B1538] pb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
