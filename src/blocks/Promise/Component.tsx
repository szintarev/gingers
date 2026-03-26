import React from 'react'
import type { PromiseBlock as PromiseBlockProps } from '@/payload-types'

export const PromiseBlockComponent: React.FC<PromiseBlockProps> = ({ label, title, description }) => {
  return (
    <section className="pt-10 pb-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          {label && (
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-12" style={{ backgroundColor: '#8B1538', opacity: 0.5 }} />
              <p className="text-xs uppercase tracking-widest" style={{ color: '#8B1538' }}>
                {label}
              </p>
              <div className="h-px w-12" style={{ backgroundColor: '#8B1538', opacity: 0.5 }} />
            </div>
          )}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
            {title}
          </h2>
          {description && (
            <p className="text-gray-500 text-sm leading-relaxed mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
