import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  listItems: Array<any> = [{ quantity: 0 }];
  constructor(private firebase: FirebaseService) {}

  ngOnInit(): void {
    const result = this.firebase.getListItems();
    result.subscribe((item) => {
      this.listItems = item;
    });
  }

  addItem(quantity: any, description: any): void {
    this.firebase.addNewListItem(Number(quantity), description);
  }

  deleteListItem(element: any): void {
    this.firebase.deleteListItem(element);
  }

  getTotalCost() {
    return this.listItems.reduce((total, currentValue) => {
      return total + Number(currentValue.quantity);
    }, 0);
  }
}
