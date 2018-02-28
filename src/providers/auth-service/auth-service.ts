//import { AuthServiceProvider } from './auth-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap'

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
}

@Injectable()
export class AuthServiceProvider {

            /* USER */ user: Observable <User>
     /* LOGIN MODAL */ showLoginModal = true;
  /* REGISTER MODAL */ showRegisterModal = false;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) { }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    //this.afAuth.auth.setPersistence('local');
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      console.log("LOGOUT")
    });
  };

  checkUserLogged() {
    if (this.afAuth.auth.currentUser !== null) {
      console.log(this.afAuth.auth.currentUser);
      return this.afAuth.auth.currentUser}
    else {
      console.log('utente NON loggato');
      return false;
    }
  }

  getUserId() {
    return this.afAuth.auth.currentUser
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }


  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }

    return userRef.set(data)

  }

  openRegisterModal() {
    this.showLoginModal = false;
    this.showRegisterModal = true;
  }

  registerWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    //firebase.auth().useDeviceLanguage();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      })
  }


}
