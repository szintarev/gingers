import React from 'react'
import type { AboutBlock as AboutBlockProps } from '@/payload-types'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

export const AboutBlock: React.FC<AboutBlockProps> = ({
  subtitle,
  title,
  description1,
  description2,
  benefits,
  mainImage,
  badgeTextPrimary,
  badgeTextSecondary,
  image2,
  image3,
  image3BadgePrimary,
  image3BadgeSecondary,
  link,
}) => {
  return (
    <section id="about" className="pt-24 pb-10 relative overflow-hidden bg-white -mt-1">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 relative h-96 rounded-2xl overflow-hidden shadow-md group">
                <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                  {typeof mainImage === 'object' && mainImage !== null && (
                    <Media
                      resource={mainImage}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute bottom-6 left-6 bg-[#8B1538] text-white px-6 py-3 rounded-full transition-transform duration-300">
                  <div className="text-2xl">{badgeTextPrimary}</div>
                  <div className="text-sm">{badgeTextSecondary}</div>
                </div>
              </div>

              <div className="relative h-64 rounded-2xl overflow-hidden shadow-md group">
                <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                  {typeof image2 === 'object' && image2 !== null && (
                    <Media
                      resource={image2}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
              </div>

              <div className="relative h-64 rounded-2xl overflow-hidden shadow-md group">
                <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                  {typeof image3 === 'object' && image3 !== null && (
                    <Media
                      resource={image3}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#8B1538]/90 to-[#8B1538]/50 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <div className="text-3xl pb-2 font-bold">{image3BadgePrimary}</div>
                    <div className="text-sm uppercase tracking-wider">{image3BadgeSecondary}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 pb-4">
                <div className="h-px w-12 bg-[#8B1538]" />
                <div className="text-[#8B1538] uppercase tracking-wider text-sm">
                  {subtitle}
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl text-gray-900 pb-6 leading-tight">
                {title}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed pb-6">
                {description1}
              </p>
              {description2 && (
                <p className="text-gray-600 leading-relaxed">
                  {description2}
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 py-6">
              {(benefits || []).map((b, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8B1538] pt-1 flex-shrink-0" />
                  <div className="text-gray-600">{b.benefit}</div>
                </div>
              ))}
            </div>

            {link && (
              <div className="pt-8">
                <CMSLink {...link} className="bg-[#8B1538] hover:bg-[#A91D3A] text-white px-8 py-3 text-base rounded-full group inline-flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 pl-2 group-hover:translate-x-1 transition-transform" />
                </CMSLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
