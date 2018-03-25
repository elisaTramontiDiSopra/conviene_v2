import { Product } from "../../classes/products/products.class";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { userInterface } from '../../classes/user/user.class';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Storage } from '@ionic/storage';
import { FireServiceProvider } from '../../providers/fire-service/fire-service';

@IonicPage()
@Component({
  selector: "page-list-products",
  templateUrl: "list-products.html"
})
export class ListProductsPage {
  productCollection: AngularFirestoreCollection<Product>;
  productsObservableList: Observable<Product[]>;

  shoppingListsCollection: AngularFirestoreCollection<any>;
  shoppingListsObservable: Observable<any[]>;

  showAlertForNameAndPrice = false;

      /* MODALS*/ showAddModal = false; adding; productForModal; quantity = 1;
  /* SEARCH BAR*/ searchTerm; filterableProductList = []; completeProductList = []
        /* UID */ uid;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore,
    public authService: AuthServiceProvider, private storage: Storage, public fireService: FireServiceProvider ) {
    this.setProductListCollection();
    this.setShoppingListCollection();
  }

  setProductListCollection() {
    this.storage.get('uid').then(res => {
      this.uid = res;
      this.productCollection = this.afs.collection("prod-" + this.uid, ref => ref.orderBy('name'));
      this.productsObservableList = this.productCollection.valueChanges();
      this.productsObservableList.subscribe(p => {
        this.filterableProductList = p;
        this.completeProductList = p;
      });
    });
  }

  setShoppingListCollection() {
    this.shoppingListsCollection = this.afs.collection("list-" + this.uid);
    this.shoppingListsObservable = this.shoppingListsCollection.valueChanges();
  }

  searchProduct(searchTerm) {
    this.filterableProductList = this.completeProductList.filter(prod => {
      console.log(prod.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
      if (prod.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        return prod
      }
    });
    if (searchTerm === '') {
      this.filterableProductList = this.completeProductList;
    }
  }

  showModal(type, product) {
    this.showAddModal = true;
    this.adding = type;
    console.log(product.name);
    this.productForModal = product;
  }

  addProductToList(product) {
    console.log(product);
    this.fireService.addProductToUserList(product, this.adding, this.quantity);
    this.showAddModal = false;
  }

  goToPage(page) {
    this.navCtrl.push(page);
  }

  goToProduct(prod) {
    this.navCtrl.push("ProductPage", { section: "productPage", product: prod });
  }
}
