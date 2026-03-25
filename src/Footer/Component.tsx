import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { CMSLink } from '@/components/Link'
import type { Footer } from '@/payload-types'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const sitemapColumns = footerData?.sitemapColumns || []

  return (
    <footer className="relative bg-[#6B0F2B] overflow-hidden -mt-1">
      {/* Decorative wave */}
      <div className="absolute top-0 left-0 right-0 z-0 leading-none">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full">
          <path
            d="M0 0L48 8C96 16 192 32 288 38C384 44 480 40 576 36C672 32 768 28 864 30C960 32 1056 40 1152 42C1248 44 1344 40 1392 38L1440 36V0H1392C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0H0Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="pb-16 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <h3 className="text-xl text-white mb-3">Gingers</h3>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              Dedicated to bringing you the finest organic ginger products for your health and wellness journey.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-white/80 flex-shrink-0" />
                <span>123 Ginger Street, Wellness City</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="w-4 h-4 text-white/80 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="w-4 h-4 text-white/80 flex-shrink-0" />
                <span>hello@gingers.rs</span>
              </div>
            </div>
          </div>

          {/* Sitemap columns */}
          {sitemapColumns.length > 0 && (
            <div className={`lg:col-span-4 grid grid-cols-2 gap-8 ${sitemapColumns.length >= 4 ? 'md:grid-cols-4' : `md:grid-cols-${sitemapColumns.length}`}`}>
              {sitemapColumns.map((col, i) => (
                <div key={i}>
                  <h4 className="text-white mb-4 font-medium">{col.heading}</h4>
                  <ul className="space-y-2">
                    {(col.links || []).map(({ link }, j) => (
                      <li key={j}>
                        <CMSLink
                          {...link}
                          className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="py-8 border-t border-white/15">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-white/50">© {new Date().getFullYear()} Gingers. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {[
                { label: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
                { label: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
                { label: 'X', icon: <Twitter className="w-4 h-4" /> },
                { label: 'Email', icon: <Mail className="w-4 h-4" /> },
              ].map((social) => (
                <Link
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
