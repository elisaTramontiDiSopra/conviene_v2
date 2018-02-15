import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListProductsPage } from './list-products';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ListProductsPage,
  ],
  imports: [
    IonicPageModule.forChild(ListProductsPage),
    ComponentsModule
  ],
})
export class ListProductsPageModule {}
