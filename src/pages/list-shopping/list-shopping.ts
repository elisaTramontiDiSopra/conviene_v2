import { ListShoppingPageModule } from './list-shopping.module';
import { Component, OnDestroy } from "@angular/core";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from "../../classes/products/products.class";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { Storage } from '@ionic/storage';
import { Observable } from "rxjs/Observable";
import * as firebase from "firebase/app";
import { FireServiceProvider } from '../../providers/fire-service/fire-service';

@IonicPage()
@Component({
  selector: "page-list-shopping",
  templateUrl: "list-shopping.html"
})

export class ListShoppingPage implements OnDestroy {
  shoppingListsCollection: AngularFirestoreCollection<any>;
  shoppingListsObservable: Observable<any[]>;
  shoppingShopsDocument: AngularFirestoreDocument<any>;
  shopsArray = [];

          /* MODAL */ showDeleteModal = false; deleteMessage = ""; secureDelete; deleteShop;
  /* SUBSCRIPTIONS */ listsSubscription;
  /* DISPLAY LISTS */ shoppingLists = []; semitransparent = []; shopsList; shopProducts = [];
         /* SPINNER*/ showSpinner;

  constructor( public navCtrl: NavController,  public navParams: NavParams,  private storage: Storage, private afs: AngularFirestore,  public fireService: FireServiceProvider) {
  }

  ngOnInit() {
    this.getShoppingLists();
  }

  getShoppingLists() {
    this.shoppingLists = [];
    this.storage.get('uid').then(res => {
      this.shoppingListsCollection = this.afs.collection("list-" + res);
      this.shoppingListsCollection.valueChanges().subscribe(res => {
        res.map(shop => {
          this.semitransparent[shop.shopName] = [];
          var tempProducts = [];
          var i = 0;
          Object.keys(shop.products).forEach(key => {
            tempProducts.push(shop.products[key])
            this.semitransparent[shop.shopName][i] = false;
            i++;
          });
          shop = {
            shopName: shop.shopName,
            products: tempProducts,
          };
          this.shoppingLists.push(shop)
        })
      });
    })
  }

  showDeleteModalConfirmation(shop) {
    this.deleteShop = shop;
    // controllo se tutti i prodotti sono stati segnati come presi (trasparent)
    // se ci sono ancora prodotti non cancellati visualizzo un messaggio di avviso
    // e imposto la variabile (per css e template) che segnali il pericolo cancellazione accidentale
    for (var product in this.semitransparent[shop]) {
      this.showDeleteModal = true;
      if (this.semitransparent[shop][product] === false) {
        this.secureDelete = false;
        this.deleteMessage =
          "Non tutti i prodotti della lista risultano presi.\n Sei sicuro di voler cancellare questa lista?";
      } else {
        this.secureDelete = true;
        this.deleteMessage =
          "Confermi di voler cancellare questa lista della spesa?";
      }
    }
  }

  deleteList() {
    this.showSpinner = true;
    this.shoppingListsCollection.doc(this.deleteShop).delete();
    setTimeout(() => {
      this.showSpinner = false;
      this.showDeleteModal = false;
    this.getShoppingLists();}, 1000)
  }

  goToPage(page) {
    this.navCtrl.push(page);
  }

  ngOnDestroy() {
    this.listsSubscription.unsubscribe();
  }

}


