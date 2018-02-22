import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { AddProductPage } from '../add-product/add-product';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { userInterface } from '../../classes/user/user.class';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  /* USER */ user: userInterface;
  showLoginModal = false;

  constructor(public navCtrl: NavController, public afAuth: AngularFireAuth, public authService: AuthServiceProvider) {

    if (this.authService.checkUserLogged() !== null) {
      this.user = this.afAuth.auth.currentUser;
      this.showLoginModal = false;
      console.log(this.user);

      /* SALVARE L'UTENTE SUL TELEFONO PER EVITARE MILLEMILA CHIAMATE */
      // se l'utente non è registrato ma è nel telefono usa i dati nel telefono per rientrare
      //altrimenti fai inserire i dati all'utente




    } else { this.showLoginModal = true }
   }

  loginWithGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
      this.user = res.user;
      this.showLoginModal = false;
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });;
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
