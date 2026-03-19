'use client'

import React, { useState, useEffect, useCallback } from 'react'
import type { ImageCarouselBlock as ImageCarouselBlockProps } from '@/payload-types'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Media } from '@/components/Media'

const variants = {
  enter: { opacity: 0, scale: 1.04 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
}

export const ImageCarouselBlock: React.FC<ImageCarouselBlockProps> = ({ slides }) => {
  const [[page, dir], setPage] = useState([0, 0])
  const safeSlides = slides || []

  const idx = safeSlides.length > 0
    ? ((page % safeSlides.length) + safeSlides.length) % safeSlides.length
    : 0

  const paginate = useCallback((newDir: number) => {
    setPage(([p]) => [p + newDir, newDir])
  }, [])

  useEffect(() => {
    if (safeSlides.length <= 1) return
    const id = setTimeout(() => paginate(1), 5000)
    return () => clearTimeout(id)
  }, [page, paginate, safeSlides.length])

  if (!safeSlides || safeSlides.length === 0) {
    return null
  }

  const currentSlide = safeSlides[idx]

  return (
    <section className="relative overflow-hidden" style={{ height: '520px' }}>
      <AnimatePresence initial={false}>
        <motion.div
          key={page}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {typeof currentSlide?.image === 'object' && currentSlide.image !== null && (
            <Media
              resource={currentSlide.image}
              className="w-full h-full object-cover"
              priority
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`cap-${page}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="absolute bottom-14 left-0 right-0 px-8 md:px-16 z-10"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 pb-2">
              <div className="h-px w-8 bg-[#8B1538]" />
              <div className="text-[#8B1538] text-xs uppercase tracking-[0.2em]">
                {String(idx + 1).padStart(2, '0')} / {String(safeSlides.length).padStart(2, '0')}
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl text-white font-medium pb-1">
              {currentSlide?.caption}
            </h3>
            <p className="text-white/60 text-sm">{currentSlide?.sub}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {safeSlides.length > 1 && (
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-10">
          {safeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(([p]) => [i, i > p ? 1 : -1])}
              className={`transition-all duration-300 rounded-full ${
                i === idx
                  ? 'w-8 h-2 bg-[#8B1538]'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {safeSlides.length > 1 && (
        <>
          <button
            onClick={() => paginate(-1)}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/25 hover:bg-[#8B1538]/80 border border-white/20 hover:border-[#8B1538] flex items-center justify-center text-white transition-all duration-300 group"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/25 hover:bg-[#8B1538]/80 border border-white/20 hover:border-[#8B1538] flex items-center justify-center text-white transition-all duration-300 group"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}
    </section>
  )
}
