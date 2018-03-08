import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  /* INPUT USER  email = ''; password = ''; //servono per non far venire fuori errori di user null*/
  user: Observable<firebase.User>;
  u; t; z; w;
  credential;

  constructor(public navCtrl: NavController, public afAuth: AngularFireAuth, public authService: AuthServiceProvider,
    private afs: AngularFirestore, private storage: Storage,
    private gplus: GooglePlus, private platform: Platform) {
    //console.log('login constructor');
    //this.user = this.afAuth.auth.currentUser;;
    this.user = this.afAuth.authState;
    //alert(this.user);
    this.storage.get('uid').then(localStorageUser => {
      //console.log(localStorageUser);
      if (localStorageUser !== '' && localStorageUser !== null) {
        this.navCtrl.setRoot('HomePage', { user: this.user });
      }
    });
  }

  loginWithGoogle() {
    if (this.platform.is('cordova')) {
      this.mobileGoogleLogin()/* .then(res => {
        //this.storage.set('uid', res.userId);
        //this.navCtrl.setRoot('HomePage');
      }); */
    } else {
      this.webGoogleLogin();
    }
  }

  mobileGoogleLogin() {
    const gplusUser = this.gplus.login({
      'webClientId': '666755449242-a57bci9vlctglliip5bt6oiq8u33fvec.apps.googleusercontent.com',
      'offline': true,
    }).then(res => {
      this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
      this.storage.set('uid', res.user.uid);
      this.navCtrl.setRoot('HomePage');
    })
  }

  webGoogleLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
      console.log(res);
      this.storage.set('uid', res.user.uid);
      this.navCtrl.setRoot('HomePage');
      //this.navCtrl.setRoot('HomePage', { uid: res.user.uid });
    }).catch(function (error) {
      var errorMessage = error.message;
      console.log(errorMessage);
    });
  }
}
