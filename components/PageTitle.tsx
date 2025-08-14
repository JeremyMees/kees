'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { usePathname } from 'next/navigation'
import {
  Disc3,
  LucideIcon,
  ShoppingCart,
  CookingPot,
  PiggyBank,
} from 'lucide-react'

interface Page {
  title: string
  icon: LucideIcon
}

export default function PageTitle() {
  const pathname = usePathname()
  const [page, setPage] = useState<Page>()

  useEffect(() => {
    const url = pathname.split('/').pop() || ''

    switch (url) {
      case 'recipes':
        setPage({ title: 'Recipes', icon: CookingPot })
        break
      case 'bank':
        setPage({ title: 'Bank', icon: PiggyBank })
        break
      case 'vinyl':
        setPage({ title: 'Vinyl Collection', icon: Disc3 })
        break
      default:
        setPage({ title: 'Shopping List', icon: ShoppingCart })
        break
    }
  }, [pathname])

  return (
    <div className="flex items-center gap-2 content py-4">
      {page?.icon ? (
        <page.icon key="icon" className="size-6 text-muted-foreground" />
      ) : (
        <Skeleton key="icon" className="size-6 rounded-full" />
      )}
      <h1 className="text-2xl font-bold">
        {page?.title || <Skeleton className="w-2/3 h-8 rounded-full" />}
      </h1>
    </div>
  )
}
