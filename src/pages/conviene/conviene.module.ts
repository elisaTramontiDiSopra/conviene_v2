import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConvienePage } from './conviene';

@NgModule({
  declarations: [
    ConvienePage,
  ],
  imports: [
    IonicPageModule.forChild(ConvienePage),
  ],
})
export class ConvienePageModule {}
