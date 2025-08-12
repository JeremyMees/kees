'use client';

import { useState, useEffect, useRef } from 'react';
import { CollectionRelease, CollectionResponse } from 'disconnect';
import ErrorCard from '@/components/ErrorCard';
import PageNavigation from '@/components/PageNavigation';
import Image from 'next/image'
import { Disc3, Shuffle, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Count from '@/components/animation/Count';

export default function Page() {
  const [collection, setCollection] = useState<CollectionResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);
  const grid = useRef<HTMLDivElement>(null);

  const perPage = 10;

  useEffect(() => {
    fetchCollection(currentPage);
  }, [currentPage]);

  async function fetchCollection (page: number) {
    try {
      setLoading(true);
      const response = await fetch(`/api/vinyl/collection?page=${page}&per_page=${perPage}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch collection data');
      }
      
      const data = await response.json();
      setCollection(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  function handlePageChange(newPage: number) {
    grid.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(newPage);
  };

  if (error) {
    return <ErrorCard error={error} title="Error loading collection" />;
  }

  const noItems = !collection || !collection.releases?.length;

  if (loading && noItems) {
    return (
      <div className="flex-1 overflow-y-auto content pt-2 pb-8">
        <Skeleton className="w-full h-[66px] mb-4" />
        <VinylCardGrid>
          {
            Array.from({ length: perPage }).map((_, i) => (<Skeleton key={i} className="w-full aspect-square" />))
          }
        </VinylCardGrid>
      </div>
    )
  }

  if (noItems) {
    return (
      <p className="text-muted-foreground">
        No collection data found.
      </p>
    );
  }

  const vinyls = collection.releases.map((release) => (<VinylCard key={release.id} release={release} />));

  return (
    <div ref={grid} className="flex-1 overflow-y-auto content pt-2 pb-8">
      <RandomVinyl items={collection.releases.length} />
      <VinylCardGrid>
        { vinyls }
      </VinylCardGrid>
      { !loading && (  
        <PageNavigation
          page={collection.pagination.page}
          pages={collection.pagination.pages}
          perPage={perPage}
          onPageChange={handlePageChange}
          className="mt-6"
        />
      )}
    </div>
  );
}

function RandomVinyl({ items }: { items: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout>(null);
  const random = Math.random() * items;

  function toggle() {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen) {
      timer.current = setTimeout(() => setIsOpen(false), 3000);
    } else if (timer.current) {
      clearTimeout(timer.current);
    }
  }

  return (
    <div className="border bg-card rounded-lg mb-4">
      <div className="p-4 flex items-center justify-between">
        <span className="font-semibold">Select Random Vinyl</span>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={toggle}
        >
          {isOpen ? <X /> : <Shuffle />}
        </Button>
      </div>
      <div 
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'h-[73px] opacity-100' : 'h-0 opacity-0'}`
        }
      >
        {isOpen && (
          <div className="p-4 border-t">
            <Count
              end={random}
              delay={300}
              className="text-4xl font-bold"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function VinylCardGrid({ children }: { children: React.ReactNode }) {
  return (
     <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  )
}

function VinylCard({ release }: { release: CollectionRelease }) {
  return (
    <div className="aspect-square bg-card rounded-lg overflow-hidden relative">
      <div className="relative w-full h-full flex items-center justify-center">
        {release.basic_information.cover_image ? (
          <>
            <Image
              src={release.basic_information.cover_image}
              alt={release.basic_information.title}
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
        {release.basic_information.title}
      </h3>
     
      <div className="absolute bottom-2 left-2 flex flex-col">
        <span className="text-sm font-semibold line-clamp-1">
          {release.basic_information.artists.map(artist => artist.name).join(', ')}
        </span>
        <span className="text-sm font-semibold line-clamp-1">
          {release.basic_information.year || 'Unknown Year'}
        </span>
      </div>
    </div>
  )
}
