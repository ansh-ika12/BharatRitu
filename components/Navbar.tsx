'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/admin', label: 'Admin' },
]

export default function Navbar({ variant = 'transparent' }: { variant?: 'transparent' | 'solid' }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isSolid = variant === 'solid'

  return (
    <header
      className={
        isSolid
          ? 'sticky top-0 z-30 border-b border-white/10 bg-brand-brown'
          : 'absolute inset-x-0 top-0 z-20'
      }
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-baseline gap-1.5 text-white">
          <span className="font-heading text-xl font-bold">Bharat</span>
          <span className="font-devanagari text-xl font-bold">ऋतु</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition hover:text-white ${pathname === link.href ? 'text-white' : 'text-white/75'}`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/report" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-brown transition hover:bg-white/90">
            Report Now
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="text-white md:hidden" aria-label="Toggle menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div className="mx-6 mt-2 flex flex-col gap-4 rounded-2xl border border-white/20 bg-black/40 p-6 backdrop-blur-lg md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm font-medium text-white/90">
              {link.label}
            </Link>
          ))}
          <Link href="/report" className="rounded-full bg-white px-5 py-2 text-center text-sm font-semibold text-brand-brown">
            Report Now
          </Link>
        </div>
      )}
    </header>
  )
}