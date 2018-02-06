import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../classes/products/products.class';

@IonicPage()
@Component({
  selector: 'page-conviene',
  templateUrl: 'conviene.html',
})
export class ConvienePage {
  productCollection: AngularFirestoreCollection<Product>;
  productsObservableList: Observable<Product[]>;

          /* SEARCH */ searchedProduct = {name: '', price: ''}
       /* BG COLORS */ white=true; yellow=false; dark=false;
  /* PRODUCT SELECT */ showProductSelect = false; showPrice = false; product; showInputPrice=false; showInputName=false;
       /* SEARCH BAR*/ filterableProductList = []; completeProductList = []
        /* MESSAGES */ convieneMessage; messages = ["Butta nel carrello che è un'occasione!", "In offerta lo trovi a meno, però è comunque meglio del prezzo normale", 'Lascia stare, lo trovi a meno!']

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
    this.productCollection = this.afs.collection("products");
    this.productsObservableList = this.productCollection.valueChanges()
  }

  ngOnInit() {
    this.productsObservableList.subscribe(p => {
      this.filterableProductList = p;
      this.completeProductList = p;
    });
  }

  searchProduct(searchTerm) {
    console.log(searchTerm);
    this.showProductSelect = true;
    this.filterableProductList = this.completeProductList.filter(prod => {
      console.log(prod.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
      if(prod.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
      return prod
      }
    });
  }

  checkPrice(price) {
    setTimeout(() => {
      //price = Number(price);
      this.product.priceSale = Number(this.product.priceSale);
      this.product.price = Number(this.product.price);
      //se è minore del prezzo offerta --- DA PRENDERE
      //se è minore del prezzo normale --- VALUTA L'OFFERTA
      //se è più alto del prezzo normale --- LASCIA STARE
      if (price < this.product.priceSale) {
        console.log('< this.product.priceSale');
        this.convieneMessage = this.messages[0];
        this.white=false;
        this.yellow=true;
        this.dark=false;
      } else if (price > this.product.priceSale && price < this.product.price) {
        console.log('< this.product.priceSale 2');
        this.convieneMessage = this.messages[1];
        this.white=true;
        this.yellow=false;
        this.dark=false;
      } else if (price > this.product.price) {
        console.log('> this.product.price');
        this.convieneMessage = this.messages[2];
        this.white=false;
        this.yellow=false;
        this.dark=true;
      }
    }, 700);
  }

  selectProduct(product) {
    this.product = product;
    this.searchedProduct.name = product.name;
    //this.searchedProduct.price = product.price;
    this.showProductSelect = false;
    this.showPrice = true;
  }

  goToPage(page){
    this.navCtrl.push(page);
    console.log(page);
  }


}
