import { CollectionRelease, Folder } from 'disconnect';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { DocumentData, getFirestore, WithFieldValue, WriteBatch } from 'firebase-admin/firestore';
import { Collection } from '@/types/firebase';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

async function getExistingIds(collection: string, field: string): Promise<Set<number>> {
  const vinylsCollection = db.collection(collection);
  const snapshot = await vinylsCollection.get();

  const existingIds = new Set<number>();

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data[field]) existingIds.add(data[field]);
  });

  return existingIds;
}

interface AddNewToBatchParams<RawData, SanitizedData> {
  collection: Collection;
  field: keyof RawData;
  sanitize: (data: RawData) => SanitizedData;
  batch: WriteBatch;
  items: RawData[];
  existingIds: Set<number>;
}

function addNewToBatch<RawData, SanitizedData>(values: AddNewToBatchParams<RawData, SanitizedData>) {
  const { collection, field, sanitize, batch, items, existingIds } = values;

  const col = db.collection(collection);
  let addedCount = 0;

  items.forEach((item) => {
    const id = item[field];

    if (typeof id === 'number' && !existingIds.has(id)) {
      const data = sanitize(item);
      const docRef = col.doc();
      batch.set(docRef, data as WithFieldValue<DocumentData>);
      addedCount++;
    }
  });

  return addedCount;
}

function sanitizeVinyl(release: CollectionRelease) {
  return {
    title: release.basic_information?.title || 'Unknown',
    coverImage: release.basic_information?.cover_image || '',
    artists: release.basic_information?.artists?.map((artist) => artist.name) || [],
    year: release.basic_information?.year?.toString() || 'Unknown',
    discogsId: release.id,
    folderId: release.folder_id,
  };
}

function sanitizeFolder(folder: Folder) {
  return {
    name: folder.name,
    count: folder.count,
    discogsId: folder.id,
  };
}

export {
  db,
  getExistingIds,
  addNewToBatch,
  sanitizeVinyl,
  sanitizeFolder,
};
