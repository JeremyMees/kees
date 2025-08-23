import { NextResponse } from 'next/server';
import Discogs from 'disconnect';

export async function GET() {
  try {
    const dis = new Discogs.Client('KeesApp/1.0', { userToken: process.env.DISCOGS_TOKEN });
    const col = dis.user().collection();

    const collectionData = await new Promise((resolve, reject) => {
      col.getFolders(
        'Jeremy-mees',
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
