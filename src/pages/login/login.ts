import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  /* INPUT USER  email = ''; password = ''; //servono per non far venire fuori errori di user null*/

  user;

  constructor(public navCtrl: NavController, public afAuth: AngularFireAuth, public authService: AuthServiceProvider, private afs: AngularFirestore, private storage: Storage) {
    //console.log('login constructor');
    this.user = this.afAuth.auth.currentUser;;
    this.storage.get('uid').then(localStorageUser =>{
      //console.log(localStorageUser);
      if (localStorageUser !== '' && localStorageUser !== null) {
        this.navCtrl.setRoot('HomePage', {user: this.user });
      }
    });
  }

  loginWithGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
      this.storage.set('uid', res.user.uid)
      this.navCtrl.setRoot('HomePage', { uid: res.user.uid });
    }).catch(function (error) {
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
}
