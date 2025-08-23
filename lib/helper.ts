import { NextRequest } from 'next/server';

interface PaginationOptions {
  baseUrl: string;
  endpoint: string;
  perPage?: number;
  delayMs?: number;
}

interface PaginationResult {
  totalItems: number;
  pagesProcessed: number;
}

export async function paginateThroughPages<T>(
  options: PaginationOptions,
  onPageData: (data: T[], pageNumber: number) => Promise<void>
): Promise<PaginationResult> {
  const { baseUrl, endpoint, perPage = 20, delayMs = 50 } = options;

  let currentPage = 1;
  let hasMorePages = true;
  let totalItems = 0;
  let pagesProcessed = 0;

  while (hasMorePages) {
    const response = await fetch(
      `${baseUrl}${endpoint}?page=${currentPage}&per_page=${perPage}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch page ${currentPage}: ${response.statusText}`);
    }

    const pageData = await response.json();

    if (!pageData.releases || pageData.releases.length === 0) {
      hasMorePages = false;
      break;
    }

    await onPageData(pageData.releases, currentPage);

    totalItems += pageData.releases.length;
    pagesProcessed++;

    if (pageData.pagination) {
      const { page, pages } = pageData.pagination;

      if (page >= pages) hasMorePages = false;
      else currentPage++;
    } else {
      if (pageData.releases.length < perPage) hasMorePages = false;
      else currentPage++;
    }

    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return {
    totalItems,
    pagesProcessed
  };
}
