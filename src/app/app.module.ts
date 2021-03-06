import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'; /* after httpModule */
import { GooglePlus } from '@ionic-native/google-plus';

import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FIREBASE_CONFIG } from './firebase.credentials';
import { Firebase } from '@ionic-native/firebase';

import { IonicStorageModule } from '@ionic/storage';


// VIEWS
import { MyApp } from './app.component';

import { ComponentsModule } from '../components/components.module'
import { FireServiceProvider } from '../providers/fire-service/fire-service';
import { HttpClient } from '@angular/common/http';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { FcmProvider } from '../providers/fcm/fcm';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule.enablePersistence(),
    ComponentsModule,
    HttpModule,
    HttpClientModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    HttpClient,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FireServiceProvider,
    AngularFireAuth,
    AuthServiceProvider,
    Firebase,
    FcmProvider,
  ]
})
export class AppModule {}
