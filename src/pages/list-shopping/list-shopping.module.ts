import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListShoppingPage } from './list-shopping';

@NgModule({
  declarations: [
    ListShoppingPage,
  ],
  imports: [
    IonicPageModule.forChild(ListShoppingPage),
  ],
})
export class ListShoppingPageModule {}
