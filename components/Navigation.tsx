'use client'

import { ShoppingCart, CookingPot, PiggyBank, Disc3 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Navigation() {
  const pathname = usePathname()

  const linkStyles =
    'size-10 flex items-center justify-center rounded-lg transition-colors duration-300'

  return (
    <section className="border border-input bg-input/30 backdrop-blur-sm rounded-xl text-primary p-2 w-fit absolute bottom-2 left-1/2 -translate-x-1/2">
      <nav className="flex gap-2 justify-center items-center content">
        <Link
          href="/"
          className={`${linkStyles} ${pathname === '/' && 'bg-muted'}`}
        >
          <ShoppingCart />
        </Link>
        <Link
          href="/recipes"
          className={`${linkStyles} ${pathname === '/recipes' && 'bg-muted'}`}
        >
          <CookingPot />
        </Link>
        <Link
          href="/money"
          className={`${linkStyles} ${pathname === '/money' && 'bg-muted'}`}
        >
          <PiggyBank />
        </Link>
        <Link
          href="/vinyl"
          className={`${linkStyles} ${pathname === '/vinyl' && 'bg-muted'}`}
        >
          <Disc3 />
        </Link>
      </nav>
    </section>
  )
}
