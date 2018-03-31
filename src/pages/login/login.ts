import { userInterface } from './../../classes/user/user.class';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus';

import { FcmProvider } from './../../providers/fcm/fcm';

import { ToastController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  /* INPUT USER  email = ''; password = ''; //servono per non far venire fuori errori di user null*/
  user: Observable<firebase.User>;
  credential;
  /* USER FIRESTORE DB */ userCollection: AngularFirestoreCollection<userInterface>; userObservableList: Observable<userInterface[]>
                /* UID */ uid;
            /* LOADING */ loading = false;

  constructor(public fcm: FcmProvider, public toastCtrl: ToastController, public navCtrl: NavController, public afAuth: AngularFireAuth, public authService: AuthServiceProvider, private afs: AngularFirestore, private storage: Storage, private gplus: GooglePlus, private platform: Platform) {
    this.user = this.afAuth.authState;
    this.storage.get('uid').then(localStorageUser => {
      if (localStorageUser !== '' && localStorageUser !== null) {
        this.navCtrl.setRoot('HomePage', { user: this.user });
      }
    });

    // Get a FCM token
    //this.fcm.getToken(usermail)

      /* this.fcm.listenToNotifications().pipe(
            tap(msg => {
              const toast = this.toastCtrl.create({
                message: msg.body,
                duration: 3000
              });
              toast.present();
            })
          ).subscribe() */
  }

  loginWithGoogle() {
    this.loading = true;
    if (this.platform.is('cordova')) {
      this.mobileGoogleLogin()
    } else {
      this.webGoogleLogin();
    }
  }

  mobileGoogleLogin() {
    const gplusUser = this.gplus.login({
      'webClientId': '666755449242-a57bci9vlctglliip5bt6oiq8u33fvec.apps.googleusercontent.com',
      'offline': true,
    }).then(res => {
      //alert(JSON.stringify(res));
      this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
      .then((suc) => {
        this.loading = false;
        this.fcm.getToken(suc['email'])
        this.storage.set('uid', suc['uid']);
        this.navCtrl.setRoot('HomePage');
        //alert(JSON.stringify(suc));
      }).catch((err) => {
        alert(err)
      });
    })
  }

  webGoogleLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
      console.log(res);
      this.loading = false;
      this.storage.set('uid', res.user.uid);
      this.navCtrl.setRoot('HomePage');
      //this.navCtrl.setRoot('HomePage', { uid: res.user.uid });
    }).catch(function (error) {
      var errorMessage = error.message;
      console.log(errorMessage);
    });
  }

  registerWithGoogle() {
    this.loading = true;
    if (this.platform.is('cordova')) {
      this.mobileRegisterGoogleLogin()
    } else {
      this.webRegisterGoogleLogin();
    }
  }

  mobileRegisterGoogleLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((suc) => console.log(suc))
  }

  webRegisterGoogleLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((suc) => {
      console.log(suc);
      this.userCollection = this.afs.collection('users');
      this.storage.set('uid', suc.user.uid);
      var user = {
        uid:  suc.user.uid,
        email:  suc.user.email,
        photoURL: suc.user.photoURL,
        displayName: suc.user.displayName,
      }
      this.userCollection.doc(suc.user.uid).set(user).then(()=> this.navCtrl.setRoot('HomePage'));
    })
  }

}
