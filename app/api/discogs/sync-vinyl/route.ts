import { db, getExistingIds, addNewToBatch, sanitizeVinyl } from '@/lib/firebase.server';
import { NextRequest, NextResponse } from 'next/server';
import { paginateThroughPages, validateCron } from '@/lib/helper';
import { CollectionRelease } from 'disconnect';

export async function GET(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') validateCron(request);

    const existingIds = await getExistingIds('vinyls', 'discogsId');
    const batch = db.batch();
    let totalAdded = 0;

    const result = await paginateThroughPages<CollectionRelease>(
      {
        baseUrl: new URL(request.url).origin,
        endpoint: '/api/discogs/collection',
      },
      async (releases) => {
        const addedCount = addNewToBatch({
          collection: 'vinyls',
          field: 'id',
          sanitize: sanitizeVinyl,
          batch,
          items: releases,
          existingIds,
        });

        totalAdded += addedCount;
      }
    );

    if (totalAdded > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      message: 'Vinyls synced successfully',
      totalAdded,
      totalItems: result.totalItems,
      pagesProcessed: result.pagesProcessed
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
