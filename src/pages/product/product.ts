import { FireServiceProvider } from './../../providers/fire-service/fire-service';
import { Component } from '@angular/core';
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
  shoppingListsCollection: AngularFirestoreCollection<Product>;

  //per visualizzare i --.-- prima di mettere il prezzo
  priceClicked = false;   priceSaleClicked = false;

  /* PARAMETERS */ section; product = {name: '', img: '', price: null, unity: 'kilo', shop: '', priceSale: null, shopSale: '', unitySale: 'kilo'} as Product;
       /* ALERT */ showAlertForNameAndPrice = false;
      /* MODALS */ showAddModal = false; adding; productForModal;  quantity = 1; showDeleteModal = false;

  constructor(
    public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore, public fireService: FireServiceProvider) {
    // se section non è specificata allora è pagina prodotto
    if (this.navParams.get('section') === undefined) {this.section = 'productPage'} else {this.section = this.navParams.get('section')}
    // se product è specificato product = prodotto specificato altrimenti resta il prodotto vuoto messo sopra in variabile
    if (this.navParams.get('product') !== undefined) {this.product = this.navParams.get('product')}
    this.productCollection = this.afs.collection("products");
    this.productsObservableList = this.productCollection.valueChanges()
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
  addProductToList(product) {
    console.log(product);
    this.fireService.addProductToUserList(product, this.adding, this.quantity);
    this.showAddModal = false;
  }

  addToCart(product, adding, quantity) {
    //this.convieneService.addToCart(product, adding, quantity);
    console.log(product);
  }

  /* addProductToList(product) {
    // add document with the name of the shop and products as property with the id as name property (to avoid copies)
    this.shoppingListsCollection = this.afs.collection("lists");
    if (this.adding === "normal") {
      //aggiungo il prodotto alla collection con il nome del negozio
      this.shoppingListsCollection.doc(product.shop).set({
        shopName: product.shop,
        products: {
          [product.id]: {
            name: product.name,
            quantity: this.quantity,
            price: product.price,
            sale: false,
            shop: product.shop,
            id: product.id
          }
        }},{merge: true});
      } else if (this.adding === "sale") {
        //aggiungo il prodotto alla collection con il nome del negozio
        this.shoppingListsCollection.doc(product.shop).set({
          shopName: product.shop,
          products: {
            [product.id]: {
              name: product.name,
              quantity: this.quantity,
              price: product.price,
              sale: true,
              shop: product.shop,
              id: product.id
            }
          }},{merge: true});
      }
    this.showAddModal = false;
  } */

  showModal(type, product) {
    this.showAddModal = true;
    this.adding = type;
    console.log(product.name);
    this.productForModal = product;
  }

  //BUTTONS FUNCTIONS
  save() {
    if (this.product.name !== '' && (this.product.price !== null || this.product.priceSale !== null)) {
      // creo un id (anche come proprietà), lo salvo come nome del documento e poi metto nel documento
      // tutte le proprietà del prodotto, id compreso
      // se l'id non esiste già vuol dire che il prodotto è nuovo e quindi lo creo, altrimenti aggiorno solo
      if (!this.product.id) {this.product.id = this.afs.createId();}
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

  addOrEditProductToDb(product) {
    if (this.fireService.addOrEditProductToDb(product) === 'productPage') {this.section = 'productPage'} else {this.section = 'editProductPage'}
  }
  deleteProductFromDB(product) {
    //console.log(product);
    this.fireService.deleteProductFromDB(product);
    this.navCtrl.push('HomePage');
  }


}
