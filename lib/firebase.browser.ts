import { initializeApp } from 'firebase/app';
import type { Food } from '@/types/firebase';
import {
  getFirestore,
  collection,
  DocumentData,
  QueryDocumentSnapshot,
  deleteDoc,
  addDoc,
  updateDoc,
  doc,
  CollectionReference
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

function create<T>(col: CollectionReference<T>, item: Omit<T, 'id'>) {
  addDoc(col, item);
}

function remove<T>(col: CollectionReference<T>, id: string) {
  deleteDoc(doc(col, id));
}

function update<T>(col: CollectionReference<T>, id: string, item: Partial<T>) {
  updateDoc(doc(col, id), item);
}

export {
  app,
  db,
  foodsCollection,
  create,
  update,
  remove
};