import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  recipes: Array<any> = [{ link: '', description: '' }];
  constructor(
    public modalController: ModalController,
    private firebase: FirebaseService
  ) {}

  ngOnInit() {
    const result = this.firebase.getRecipes();
    result.subscribe((items) => {
      this.recipes = items;
    });
  }

  async presentAddModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }

  deleteRecipes(element: any): void {
    this.firebase.deleteRecipes(element);
  }
}
