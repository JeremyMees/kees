import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore) {}

  addNewListItem(quantity: number, description: string): void {
    const data = {
      quantity: quantity,
      description: description,
      date: new Date(),
    };
    this.firestore.collection('money').add(data);
  }

  getListItems(): Observable<any[]> {
    return this.firestore.collection('money').valueChanges();
  }

  deleteListItem(item: any): void {
    this.firestore
      .collection('money', (ref) =>
        ref.where('quantity', '==', item.quantity).limit(1)
      )
      .get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.firestore.collection('money').doc(`${doc.id}`).delete();
        });
      });
  }

  addNewFoodItem(product: string): void {
    const data = {
      product: product,
    };
    this.firestore.collection('food').add(data);
  }

  getFoodItems(): Observable<any[]> {
    return this.firestore.collection('food').valueChanges();
  }

  deleteFoodItem(item: any): void {
    this.firestore
      .collection('food', (ref) => ref.where('product', '==', item.product))
      .get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.firestore.collection('food').doc(`${doc.id}`).delete();
        });
      });
  }

  addNewRecipes(link: string, description: string): void {
    const data = {
      link: link,
      description: description,
    };
    this.firestore.collection('recipes').add(data);
  }

  getRecipes(): Observable<any[]> {
    return this.firestore.collection('recipes').valueChanges();
  }

  deleteRecipes(item: any): void {
    this.firestore
      .collection('recipes', (ref) =>
        ref.where('description', '==', item.description)
      )
      .get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.firestore.collection('recipes').doc(`${doc.id}`).delete();
        });
      });
  }
}
