import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConvienePage } from './conviene';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ConvienePage
  ],
  imports: [
    IonicPageModule.forChild(ConvienePage),
    ComponentsModule
  ],
})
export class ConvienePageModule {}
