import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Injectable()
export class FcmProvider {
  user;

  constructor(
    public firebaseNative: Firebase,
    public afs: AngularFirestore,
    private platform: Platform, public afAuth: AngularFireAuth, public authService: AuthServiceProvider,
  ) {
    /* this.user = this.afAuth.auth;
    console.log('user');
    console.log(this.user) */
    //alert(JSON.stringify(this.user));
  }

  // Get permission from the user
  async getToken(usermail) {
    let token;
    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
    }
    if (!this.platform.is('cordova')) {
      console.log('sei su browser');
    }
    return this.saveTokenToFirestore(token, usermail)
  }

  // Save the token to firestore
  private saveTokenToFirestore(token, usermail) {
    if (!token) return;
    const devicesRef = this.afs.collection('devices')
    const docData = {
      token,
      userEmail: usermail,
    }
    return devicesRef.doc(usermail).set(docData)
  }

  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen()
  }

}
