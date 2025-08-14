import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PageNavigationProps {
  page: number
  pages: number
  perPage: number
  onPageChange: (newPage: number) => void
  className?: string
}

export default function PageNavigation({
  page,
  pages,
  onPageChange,
  className,
}: PageNavigationProps) {
  const renderPageNumbers = () => {
    const items = []

    if (pages <= 5) {
      // If 5 or fewer pages, show all page numbers
      for (let i = 1; i <= pages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(i)
              }}
              isActive={page === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      // More than 5 pages, show smart pagination
      if (page <= 3) {
        // Near the beginning
        for (let i = 1; i <= 3; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(i)
                }}
                isActive={page === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          )
        }
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        )
        items.push(
          <PaginationItem key={pages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(pages)
              }}
            >
              {pages}
            </PaginationLink>
          </PaginationItem>
        )
      } else if (page >= pages - 2) {
        // Near the end
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(1)
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>
        )
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        )
        for (let i = pages - 2; i <= pages; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(i)
                }}
                isActive={page === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          )
        }
      } else {
        // In the middle
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(1)
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>
        )
        items.push(
          <PaginationItem key="ellipsis3">
            <PaginationEllipsis />
          </PaginationItem>
        )
        for (let i = page - 1; i <= page + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(i)
                }}
                isActive={page === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          )
        }
        items.push(
          <PaginationItem key="ellipsis4">
            <PaginationEllipsis />
          </PaginationItem>
        )
        items.push(
          <PaginationItem key={pages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(pages)
              }}
            >
              {pages}
            </PaginationLink>
          </PaginationItem>
        )
      }
    }

    return items
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (page > 1) {
                onPageChange(page - 1)
              }
            }}
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (page < pages) {
                onPageChange(page + 1)
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
