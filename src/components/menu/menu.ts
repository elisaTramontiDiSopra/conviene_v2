import { Component, ViewChild, HostListener, ElementRef } from '@angular/core';
import { FabContainer, NavController } from 'ionic-angular';

@Component({
  selector: 'menu',
  templateUrl: 'menu.html'
})
export class MenuComponent {
  @ViewChild('fablist') fablist: FabContainer;
  open = false;

  constructor(public navCtrl: NavController,
    private eRef: ElementRef) { }

/*   @HostListener('document:click', ['$event'])
  public documentClick(event: Event): void {
    console.log('ok');
    if(open) { this.fablist.close();} else {this.fablist.open();}
  } */

  reduceMenu() {
    this.fablist.close();
    this.open= false;
  }

  gotoPage(page) {
    this.navCtrl.push(page);
  }
  gotoAddProductPage() {
    this.navCtrl.push('ProductPage', {section: 'editProductPage'});
  }

}

