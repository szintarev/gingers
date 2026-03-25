import React from 'react'
import Link from 'next/link'

export async function Footer() {
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

      {/* Sitemap */}
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="pb-16 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Products */}
          <div>
            <h4 className="text-white mb-4 font-medium">Products</h4>
            <ul className="space-y-2">
              {['Fresh Ginger', 'Ginger Tea', 'Essential Oils', 'Supplements', 'All Products'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white mb-4 font-medium">Company</h4>
            <ul className="space-y-2">
              {[
                { label: 'About Us', href: '#about' },
                { label: 'Our Story', href: '#' },
                { label: 'Sustainability', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Blog', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-colors duration-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white mb-4 font-medium">Support</h4>
            <ul className="space-y-2">
              {[
                { label: 'Contact Us', href: '#contact' },
                { label: 'FAQ', href: '#' },
                { label: 'Shipping Info', href: '#' },
                { label: 'Returns', href: '#' },
                { label: 'Track Order', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-colors duration-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white mb-4 font-medium">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
