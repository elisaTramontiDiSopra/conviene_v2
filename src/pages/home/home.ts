import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

      /* UID */  uid;
  /* STORAGE */ local;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.uid = this.navParams.get('uid');
    console.log('home uid '+this.uid);
  }


  goToPage(page) {
    this.navCtrl.push(page);
    console.log(page);
  }

}
