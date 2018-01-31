import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddProductPage } from '../add-product/add-product';

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
