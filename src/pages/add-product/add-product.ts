import { HomePage } from './../home/home';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from '../../classes/products/products.class';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/**
 * Generated class for the AddProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})
export class AddProductPage implements OnInit {

  product = {name: '', img: '', price: null, unity: 'kilo', shop: 'COOP', priceSale: '', shopSale: '', unitySale: 'kilo'} as Product;

  productCollection: AngularFirestoreCollection<Product>;
  productsObservableList: Observable<Product[]>;
  productDocument: AngularFirestoreDocument<Product>;
  productObservableDocument: Observable<Product>;

  section = 'productPage';

  //per visualizzare i --.-- prima di mettere il prezzo
  priceClicked = false;
  priceSaleClicked = false;
  //per visualizzare l'alert se non si mette nome e almeno un prezzo quando si salva
  showAlertForNameAndPrice = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {}

  ngOnInit() {
    this.productCollection = this.afs.collection('products', ref => {
      return ref.orderBy('name');
    });
    this.productsObservableList = this.productCollection.valueChanges();

    this.productCollection = this.afs.collection('products', ref => {
      return ref.orderBy('name');
    });
    this.productsObservableList = this.productCollection.valueChanges();
  }

  addToCart(product) {
    console.log(product);
  }

  //BUTTONS FUNCTIONS
  save() {
    if (this.product.name !== '' && (this.product.price !== null || this.product.priceSale !== null)) {
      this.productCollection.add(this.product);
      this.section = 'productPage';
    } else {
      this.showAlertForNameAndPrice = true;
      console.log("alert");
    }
  }
  delete() {
    this.product = {name: '', img: '', price: null, unity: 'kilo', shop: '', priceSale: '', shopSale: '', unitySale: 'kilo'};
    this.priceClicked = false;
    this.priceSaleClicked = false;
  }
  goToPage(page) {
    this.navCtrl.push(page);
    console.log(page);
  }
  goBack() {
    this.navCtrl.pop();
  }
  edit() {
    this.section='editProductPage';
  }
}
