import { NgModule } from '@angular/core';
import { MenuComponent } from './menu/menu';
import { IonicModule } from 'ionic-angular'
import { LoaderComponent } from './loader/loader';

@NgModule({
	declarations: [
    MenuComponent,
    LoaderComponent
  ],
	imports: [
    IonicModule
  ],
	exports: [
    MenuComponent,
    LoaderComponent
  ]
})
export class ComponentsModule {}
