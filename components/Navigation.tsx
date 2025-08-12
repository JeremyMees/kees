'use client'

import { ShoppingCart, CookingPot, PiggyBank, Disc3 } from "lucide-react"
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Navigation() {
  const pathname = usePathname()

  const linkStyles = 'size-10 flex items-center justify-center rounded-lg transition-colors duration-300'

  return (
    <section className="bg-background border-t py-2">
      <nav className="flex justify-center items-center gap-4 content">
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
        <Link href="/bank"
          className={`${linkStyles} ${pathname === '/bank' && 'bg-muted'}`}
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
  );
}