import { Product } from "../../classes/products/products.class";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-list-products",
  templateUrl: "list-products.html"
})
export class ListProductsPage {
  productCollection: AngularFirestoreCollection<Product>;
  productsObservableList: Observable<Product[]>;
  productDocument: AngularFirestoreDocument<Product>;
  productObservableDocument: Observable<Product>;

  shoppingListsCollection: AngularFirestoreCollection<any>;
  shoppingListsObservable: Observable<any[]>;
  shoppingShopsCollection: AngularFirestoreCollection<any>;

  showAlertForNameAndPrice = false;
  // Modal vars
  showAddModal = false;
  adding;
  productForModal;
  quantity = 1;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.productCollection = this.afs.collection("products");
    /* this.productCollection = this.afs.collection('products', ref => {
      return ref.orderBy('name');
    }); */
    this.productsObservableList = this.productCollection.valueChanges();
    console.log(this.productCollection);
    console.log(this.productsObservableList);
  }

  showModal(type, product) {
    this.showAddModal = true;
    this.adding = type;
    console.log(product.name);
    this.productForModal = product;
  }

  addProductToList(product) {
    console.log(product);
    console.log(product.name);
    console.log(product.shop);
    this.shoppingListsCollection = this.afs.collection("lists");
    this.shoppingShopsCollection = this.afs.collection("shops");
    if (this.adding === "normal") {
      //aggiungo il prodotto alla collection con il nome del negozio
      this.shoppingListsCollection
        .doc("shops")
        .collection(product.shop)
        .add({
          name: product.name,
          quantity: this.quantity,
          price: product.price,
          sale: false,
          shop: product.shop
        });
      //vedo se il nome del negozio è già in lista
      this.shoppingShopsCollection.doc("shopLists").valueChanges().subscribe(res => {
        if (res === null) {
          this.shoppingShopsCollection
            .doc("shopLists")
            .set({ [product.shop]: true });
        } else {
          this.shoppingShopsCollection
            .doc("shopLists")
            .update({ [product.shop]: true });
        }
      });
    }
    this.showAddModal = false;
  }

  goToProduct(product) {
    console.log(product);
  }
  goToPage(page) {
    this.navCtrl.push(page);
  }
}
