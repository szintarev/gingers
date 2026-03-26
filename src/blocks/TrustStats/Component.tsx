import React from 'react'
import type { TrustStatsBlock as TrustStatsBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'

export const TrustStatsBlockComponent: React.FC<TrustStatsBlockProps> = ({
  label,
  title,
  description,
  image,
  quoteText,
  quotePersonName,
  quotePersonTitle,
  stats,
}) => {
  const initial = quotePersonName?.[0]?.toUpperCase() ?? 'N'

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">

          {/* Left — image + quote card */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden" style={{ height: '420px' }}>
              {typeof image === 'object' && image !== null ? (
                <Media resource={image} fill imgClassName="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>

            {(quoteText || quotePersonName) && (
              <div className="absolute bottom-6 left-6 right-6 bg-white rounded-xl shadow-lg p-5">
                {quoteText && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                    &ldquo;{quoteText}&rdquo;
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                    style={{ backgroundColor: '#8B1538' }}
                  >
                    {initial}
                  </div>
                  <div>
                    {quotePersonName && (
                      <div className="text-gray-900 text-sm font-medium">{quotePersonName}</div>
                    )}
                    {quotePersonTitle && (
                      <div className="text-gray-400 text-xs">{quotePersonTitle}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right — label, title, description, stats */}
          <div className="space-y-6">
            {label && (
              <div className="flex items-center gap-3">
                <div className="h-px w-8" style={{ backgroundColor: '#8B1538' }} />
                <span className="text-xs uppercase tracking-widest font-medium" style={{ color: '#8B1538' }}>
                  {label}
                </span>
              </div>
            )}

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {title}
            </h2>

            {description && (
              <p className="text-gray-500 text-sm leading-relaxed">
                {description}
              </p>
            )}

            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-5"
                    style={{ backgroundColor: 'rgba(139,21,56,0.06)' }}
                  >
                    <div className="text-2xl font-bold mb-1" style={{ color: '#8B1538' }}>
                      {stat.value}
                    </div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
