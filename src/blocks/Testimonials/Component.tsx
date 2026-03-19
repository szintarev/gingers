import React from 'react'
import type { TestimonialsBlock as TestimonialsBlockProps } from '@/payload-types'
import { Star, Quote } from 'lucide-react'

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({
  subtitle,
  title,
  description,
  testimonials,
  overallRating,
}) => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center pb-16">
          <div className="inline-flex items-center gap-2 pb-4">
            <div className="h-px w-12 bg-[#8B1538]" />
            <div className="text-[#8B1538] uppercase tracking-wider text-sm">
              {subtitle || 'TESTIMONIALS'}
            </div>
            <div className="h-px w-12 bg-[#8B1538]" />
          </div>
          <h2 className="text-4xl md:text-6xl text-gray-900 pb-6">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {(testimonials || []).map((testimonial, index) => (
            <div key={index} className="group transition-transform hover:-translate-y-2 duration-300">
              <div className="relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#8B1538]/40 transition-all duration-300 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#8B1538] rounded-full flex items-center justify-center">
                  <Quote className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-1 pb-4 pt-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#8B1538] fill-[#8B1538]" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed pb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="pt-4 border-t border-gray-200 mt-auto">
                  <div className="text-gray-900 font-medium">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {overallRating && (
          <div className="text-center pt-16">
            <div className="inline-flex items-center gap-6 bg-white px-12 py-6 rounded-full border border-gray-200">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-[#8B1538] fill-[#8B1538]" />
                ))}
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div>
                <div className="text-2xl text-[#8B1538]">
                  {overallRating.score}/{overallRating.maxScore}
                </div>
                <div className="text-sm text-gray-600">
                  {overallRating.reviewCountText}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
