import { HomePage } from './../home/home';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController,  NavParams} from 'ionic-angular';
import { Product } from '../../classes/products/products.class';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {

  productCollection: AngularFirestoreCollection<Product>;
  productsObservableList: Observable<Product[]>;
  productDocument: AngularFirestoreDocument<Product>;
  productObservableDocument: Observable<Product>;

  //per visualizzare i --.-- prima di mettere il prezzo
  priceClicked = false;   priceSaleClicked = false;

  /* PARAMETERS */ section; product = {name: '', img: '', price: null, unity: 'kilo', shop: '', priceSale: '', shopSale: '', unitySale: 'kilo'} as Product;
       /* ALERT */ showAlertForNameAndPrice = false;


  constructor(
    public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
    // se section non è specificata allora è pagina prodotto
    if (this.navParams.get('section') === undefined) {this.section = 'productPage'} else {this.section = this.navParams.get('section')}
    // se product è specificato product = prodotto specificato altrimenti resta il prodotto vuoto messo sopra in variabile
    if (this.navParams.get('product') !== undefined) {this.product = this.navParams.get('product')}
  }

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

  // ADD TO CART
  showAddToCartModal() {}

  addToCart(product, adding, quantity) {
    //this.convieneService.addToCart(product, adding, quantity);
    console.log(product);
  }

  //BUTTONS FUNCTIONS
   save() {
    if (this.product.name !== '' && (this.product.price !== null || this.product.priceSale !== null)) {
      // creo un id (anche come proprietà), lo salvo come nome del documento e poi metto nel documento
      // tutte le proprietà del prodotto, id compreso
      // se l'id non esiste già vuol dire che il prodotto è nuovo e quindi lo creo, altrimenti aggiorno solo
      //if (!this.product.id) {this.product.id = this.afs.createId();}
      this.product.id = this.afs.createId();
      this.productCollection.doc(this.product.id).set(this.product);
      this.section = 'productPage';
    } else {
      this.showAlertForNameAndPrice = true;
      console.log("alert");
    }
  }
  delete() {
    this.product = {name: '', img: '', price: null, unity: 'kilo', shop: '', priceSale: '', shopSale: '', unitySale: 'kilo', id: ''};
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
