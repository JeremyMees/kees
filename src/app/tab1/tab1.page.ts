import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  foodItems: Array<any> = [{ product: '' }];
  constructor(private firebase: FirebaseService) {}

  ngOnInit(): void {
    const result = this.firebase.getFoodItems();
    result.subscribe((items) => {
      this.foodItems = items;
    });
  }

  addItem(product: any): void {
    this.firebase.addNewFoodItem(product);
  }

  deleteListItem(element: any): void {
    this.firebase.deleteFoodItem(element);
  }
}
