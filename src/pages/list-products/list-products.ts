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

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore, public authService: AuthServiceProvider, private storage: Storage) {
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
        }
      }, { merge: true });
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
        }
      }, { merge: true });
    }
    /* THIS DOWN HERE WORKS
    this.shoppingListsCollection = this.afs.collection("lists");
    this.shoppingShopsCollection = this.afs.collection("shops");
    if (this.adding === "normal") {
      //aggiungo il prodotto alla collection con il nome del negozio
      this.shoppingListsCollection.doc("shops").collection(product.shop).doc(product.id).set({
          name: product.name,
          quantity: this.quantity,
          price: product.price,
          sale: false,
          shop: product.shop,
          id: product.id
        });
    } else if (this.adding === "sale") {
      //aggiungo il prodotto alla collection con il nome del negozio
      this.shoppingListsCollection.doc("shops").collection(product.shop).doc(product.id).set({
          name: product.name,
          quantity: this.quantity,
          price: product.priceSale,
          sale: true,
          shop: product.shopSale,
          id: product.id
        });
    }
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
    });*/
    this.showAddModal = false;
  }

  goToPage(page) {
    this.navCtrl.push(page);
  }

  goToProduct(prod) {
    this.navCtrl.push("ProductPage", { section: "productPage", product: prod });
  }
}
