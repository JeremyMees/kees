import { db, getExistingIds, addNewToBatch, sanitizeFolder } from '@/lib/firebase.server';
import { NextRequest, NextResponse } from 'next/server';
import { Folder } from 'disconnect';

export async function GET(request: NextRequest) {
  try {
    const existingIds = await getExistingIds('vinylFolders', 'discogsId');
    const batch = db.batch();
    let totalAdded = 0;

    const response = await fetch(`${new URL(request.url).origin}/api/discogs/folders`);
    const { folders } = await response.json();

    const addedCount = addNewToBatch({
      collection: 'vinylFolders',
      field: 'id',
      sanitize: sanitizeFolder,
      batch,
      items: folders.filter(({ id }: Folder) => id > 1),
      existingIds,
    });

    totalAdded += addedCount;

    if (totalAdded > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      message: 'Folders synced successfully',
      totalAdded
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
