import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { AddProductPage } from '../add-product/add-product';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user = {
    name: '',
    password: ''
  };
  showLoginModal = false;

  constructor(public navCtrl: NavController, public afAuth: AngularFireAuth, public authService: AuthServiceProvider) {
   if (afAuth.authState) {
     console.log('utente autenticato');
     this.showLoginModal = false;
    } else {this.showLoginModal = true}
   }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.navCtrl.setRoot('HomePage');
    });
  };


  goToPage(page) {
    this.navCtrl.push(page);
    console.log(page);
  }



}
