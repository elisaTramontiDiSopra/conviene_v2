import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListShoppingPage } from './list-shopping';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ListShoppingPage,
  ],
  imports: [
    IonicPageModule.forChild(ListShoppingPage),
    ComponentsModule
  ],
})
export class ListShoppingPageModule {}
