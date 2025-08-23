import { initializeApp } from 'firebase/app';
import type { Collection, Food, Money, Recipe, Vinyl, VinylFolder } from '@/types/firebase';
import {
  getFirestore,
  collection,
  DocumentData,
  QueryDocumentSnapshot,
  deleteDoc,
  addDoc,
  updateDoc,
  doc,
  CollectionReference,
  DocumentSnapshot,
  getDocs,
  query,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  orderBy,
  where,
  WhereFilterOp,
} from 'firebase/firestore';

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(clientCredentials);

const db = getFirestore(app);

function assignTypes<T extends object>() {
  return {
    toFirestore(doc: T): DocumentData {
      return doc
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      return snapshot.data()! as T
    },
  }
}

const foodsCollection = collection(db, 'food').withConverter(assignTypes<Food>())
const recipesCollection = collection(db, 'recipes').withConverter(assignTypes<Recipe>())
const moneyCollection = collection(db, 'money').withConverter(assignTypes<Money>())
const vinylsCollection = collection(db, 'vinyls').withConverter(assignTypes<Vinyl>())
const vinylFoldersCollection = collection(db, 'vinylFolders').withConverter(assignTypes<VinylFolder>())

function create<T>(col: CollectionReference<T>, item: Omit<T, 'id'>) {
  addDoc(col, item);
}

function remove<T>(col: CollectionReference<T>, id: string) {
  deleteDoc(doc(col, id));
}

function update<T>(col: CollectionReference<T>, id: string, item: Partial<T>) {
  updateDoc(doc(col, id), item);
}

interface GetPaginatedDataProps {
  col: Collection;
  orderByField: string;
  direction: 'next' | 'prev' | undefined;
  startAfterDoc: DocumentSnapshot | undefined;
  endBeforeDoc: DocumentSnapshot | undefined;
  perPage: number;
  filters?: Array<{
    field: string;
    operator: WhereFilterOp;
    value: unknown;
  }>;
}
async function getPaginatedData<T>(props: GetPaginatedDataProps) {
  const {
    col,
    orderByField,
    direction,
    startAfterDoc,
    endBeforeDoc,
    perPage,
    filters = [],
  } = props;

  const dataCollection = collection(db, col);
  let dataQuery;

  const queryConstraints = [
    ...filters.map(filter => where(filter.field, filter.operator, filter.value)),
    orderBy(orderByField)
  ];

  if (direction === 'next' && startAfterDoc) {
    dataQuery = query(
      dataCollection,
      ...queryConstraints,
      startAfter(startAfterDoc),
      limit(perPage)
    );
  } else if (direction === 'prev' && endBeforeDoc) {
    dataQuery = query(
      dataCollection,
      ...queryConstraints,
      endBefore(endBeforeDoc),
      limitToLast(perPage)
    );
  } else {
    dataQuery = query(
      dataCollection,
      ...queryConstraints,
      limit(perPage)
    );
  }

  const productsSnapshot = await getDocs(dataQuery);
  const products = productsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));

  return {
    result: products as T[],
    lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1] || null,
    firstDoc: productsSnapshot.docs[0] || null,
    hasNext: productsSnapshot.docs.length === perPage,
    hasPrev: direction === 'next' || direction === 'prev',
  };
};

async function getCollectionData<T>(col: Collection) {
  const dataCollection = collection(db, col);
  const dataSnapshot = await getDocs(dataCollection);

  return dataSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as T[];
}

export {
  app,
  db,
  foodsCollection,
  recipesCollection,
  moneyCollection,
  vinylsCollection,
  vinylFoldersCollection,
  create,
  update,
  remove,
  getPaginatedData,
  getCollectionData
};