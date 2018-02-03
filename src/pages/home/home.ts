import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { AddProductPage } from '../add-product/add-product';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {}

  goToPage(page){
    this.navCtrl.push(page);
    console.log(page);
  }

}
