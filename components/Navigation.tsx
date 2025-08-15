'use client'

import { ShoppingCart, CookingPot, PiggyBank, Disc3 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Navigation() {
  const pathname = usePathname()

  const linkStyles =
    'size-10 flex items-center justify-center rounded-lg transition-colors duration-300'

  return (
    <section className="bg-background border-t py-2">
      <nav className="flex justify-center items-center content">
        <Link
          href="/"
          className={`${linkStyles} ${pathname === '/' && 'bg-muted'}`}
        >
          <ShoppingCart className="size-4" />
        </Link>
        <Link
          href="/recipes"
          className={`${linkStyles} ${pathname === '/recipes' && 'bg-muted'}`}
        >
          <CookingPot className="size-4" />
        </Link>
        <Link
          href="/money"
          className={`${linkStyles} ${pathname === '/money' && 'bg-muted'}`}
        >
          <PiggyBank className="size-4" />
        </Link>
        <Link
          href="/vinyl"
          className={`${linkStyles} ${pathname === '/vinyl' && 'bg-muted'}`}
        >
          <Disc3 className="size-4" />
        </Link>
      </nav>
    </section>
  )
}
