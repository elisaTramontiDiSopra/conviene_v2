import { Component } from '@angular/core';

@Component({
  selector: 'menu',
  templateUrl: 'menu.html'
})
export class MenuComponent {

  text: string;

  constructor() {
    console.log('Hello MenuComponent Component');
    this.text = 'Hello World';
  }

}
