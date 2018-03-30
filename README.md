### :point_right: This starter repo has moved to the [ionic-team/starters](https://github.com/ionic-team/starters/tree/master/ionic-angular/official/blank) repo! :point_left:


TO IMPLEMENT GOOGLE LOGIN


in config.xml check the app id that should be something like com.companyname.appname
<widget id="com.angularfirebase.myproject" ...>

Add the plugins to make it work on mobile (and not open a new browser tab)
ionic cordova plugin add cordova-plugin-googleplus (--variable REVERSED_CLIENT_ID=yourReversedClientID this second part only for iOs)
npm install --save @ionic-native/google-plus

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { GooglePlus } from '@ionic-native/google-plus'; // We'll install this in the next section

const firebaseConfig = {
  // your config
}

@NgModule({
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig), // <-- firebase here
    AngularFireAuthModule
  ],
  providers: [
    GooglePlus, // <-- gplus here (installed in the next section)
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})

To generate the SSH-1 key
keytool -exportcert -list -v -alias androiddebugkey -keystore C:/Users/___USERNAME___/.android/debug.keystore
passowrd: android

If keytool comand gives an erro check java sdk is in the variable and sdk/bin is in the path


In the login function you have to specify the weblientid
It's in firebase > authantication > Access method > google (click) > sdk configuration > Id client web
