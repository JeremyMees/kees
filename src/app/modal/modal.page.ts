import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage {
  constructor(
    public modalController: ModalController,
    private firebase: FirebaseService
  ) {}

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  addItem(link: string, description: string): void {
    this.firebase.addNewRecipes(link, description);
    this.dismiss();
  }
}
