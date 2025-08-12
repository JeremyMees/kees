import { NextRequest, NextResponse } from 'next/server';
import Discogs from 'disconnect';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 1;
  const perPage = searchParams.get('per_page') || 20;

  try {
    const dis = new Discogs.Client('GroceriesApp/1.0', { userToken: process.env.DISCOGS_TOKEN });
    const col = dis.user().collection();

    const collectionData = await new Promise((resolve, reject) => {
      col.getReleases(
        'Jeremy-mees',
        0, // 0 is the "All" folder
        {
          page: Number(page),
          per_page: Number(perPage),
          sort: 'label',
          sort_order: 'asc'
        },
        (err, data) => {
          if (err) reject(err);
          else resolve(data);
        }
      );
    });

    return NextResponse.json(collectionData);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
