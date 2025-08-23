'use client'

import { useState, useEffect, useRef } from 'react'
import ErrorCard from '@/components/ErrorCard'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Disc3 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { getCollectionData, getPaginatedData } from '@/lib/firebase.browser'
import type { Vinyl, VinylFolder } from '@/types/firebase'
import { DocumentSnapshot, WhereFilterOp } from 'firebase/firestore'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export default function Page() {
  const [vinyls, setVinyls] = useState<Vinyl[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [currentPage, setCurrentPage] = useState(1)
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
  const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | null>(null)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)

  const [folders, setFolders] = useState<VinylFolder[]>([])
  const [selectedFolders, setSelectedFolders] = useState<number[]>([])

  const containerRef = useRef<HTMLDivElement>(null)

  const perPage = 10

  useEffect(() => { fetchFolders() }, [])

  useEffect(() => { fetchVinyls() }, [selectedFolders])

  async function fetchFolders() {
    const result = await getCollectionData<VinylFolder>('vinylFolders')
    setFolders(result)
  }

  async function fetchVinyls(direction?: 'next' | 'prev') {
    try {
      setLoading(true)

      const filters = [];
      
      if (selectedFolders.length > 0) {
        filters.push({ field: 'folderId', operator: 'in' as WhereFilterOp, value: selectedFolders });
      }
      
      const result = await getPaginatedData<Vinyl>(
        {
          col: 'vinyls',
          orderByField: 'title',
          direction,
          startAfterDoc: direction === 'next' ? lastDoc || undefined : undefined,
          endBeforeDoc: direction === 'prev' ? firstDoc || undefined : undefined,
          perPage,
          filters,
        }
      )
      
      setVinyls(result.result)
      setLastDoc(result.lastDoc)
      setFirstDoc(result.firstDoc)
      setHasNext(result.hasNext)
      setHasPrev(result.hasPrev)
      
      if (direction === 'next') setCurrentPage(prev => prev + 1)
      else if (direction === 'prev') setCurrentPage(prev => Math.max(1, prev - 1))
      else setCurrentPage(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  function nextPage() {
    if (hasNext) {
      fetchVinyls('next')
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }
  
  function prevPage() {
    if (hasPrev) {
      fetchVinyls('prev')
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  if (error) {
    return <ErrorCard error={error} title="Error loading collection" />
  }

  const noItems = !vinyls.length

  if (loading && noItems) {
    return (
      <div className="flex-1 overflow-y-auto content pt-2 pb-8">
        <div className="flex flex-wrap gap-1 mb-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-7 rounded-full"
              style={{
                width: `${Math.floor(Math.random() * (100 - 70 + 1)) + 70}px`,
              }}
            />
          ))}
        </div>
        <VinylCardGrid>
          {Array.from({ length: perPage }).map((_, i) => (
            <Skeleton key={i} className="w-full aspect-square" />
          ))}
        </VinylCardGrid>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto content pt-2 pb-8">
      <VinylFilters
        folders={folders}
        selectedFolders={selectedFolders}
        setSelectedFolders={setSelectedFolders}
      />
      <VinylCardGrid>
        {vinyls.map((vinyl) => (
          <VinylCard key={vinyl.id} vinyl={vinyl} />
        ))}
      </VinylCardGrid>
      {!loading && (hasNext || hasPrev) && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevPage}
            disabled={!hasPrev}
          >
            <ChevronLeft />
          </Button>
          <span className="text-sm">
            {currentPage}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextPage}
            disabled={!hasNext}
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  )
}

interface VinylFiltersProps {
  folders: VinylFolder[]
  selectedFolders: number[]
  setSelectedFolders: (folders: number[]) => void
}

function VinylFilters(props: VinylFiltersProps) {
  const { folders, selectedFolders, setSelectedFolders } = props
  
  return (
    <ToggleGroup
      onValueChange={(e) => { setSelectedFolders(e.map(item => Number(item))) }}
      value={selectedFolders.map(id => id.toString())}
      wrap
      variant="outline"
      type="multiple"
      className="mb-4"
    >
      {folders.map((folder) => (
        <ToggleGroupItem key={folder.discogsId} value={folder.discogsId.toString()}>
          {folder.name}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

function VinylCardGrid({ children }: { children: React.ReactNode }) {
  const [list] = useAutoAnimate()

  return (
    <div className="space-y-6">
      <div
        ref={list}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {children}
      </div>
    </div>
  )
}

function VinylCard({ vinyl }: { vinyl: Vinyl }) {
  return (
    <div className="aspect-square bg-card rounded-lg overflow-hidden relative">
      <div className="relative w-full h-full flex items-center justify-center">
        {vinyl.coverImage ? (
          <>
            <Image
              src={vinyl.coverImage}
              alt={vinyl.title}
              className="w-full h-full object-cover"
              width={100}
              height={100}
              quality={80}
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <Disc3 className="size-16 text-muted-foreground" />
        )}
      </div>

      <h3 className="font-bold text-lg mb-1 line-clamp-2 absolute top-2 left-2">
        {vinyl.title}
      </h3>

      <div className="absolute bottom-2 left-2 flex flex-col">
        <span className="text-sm font-semibold line-clamp-1">
          {vinyl.artists.join(', ')}
        </span>
        <span className="text-sm font-semibold line-clamp-1">
          {vinyl.year || 'Unknown Year'}
        </span>
      </div>
    </div>
  )
}
