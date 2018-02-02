import { ListShoppingPageModule } from './list-shopping.module';
import { Component, OnDestroy } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Product } from "../../classes/products/products.class";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import * as firebase from "firebase/app";

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

          /* MODAL */ showDeleteModal = false; deleteMessage = "";  secureDelete; deleteShop;
  /* SUBSCRIPTIONS */ listsSubscription;
  /* DISPLAY LISTS */ shoppingLists = []; semitransparent = [];
         /* SPINNER*/ showSpinner;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore ) {
    this.shoppingListsCollection = this.afs.collection("lists");
    this.shoppingShopsDocument = this.afs.collection("shops").doc("shopLists");
  }

  ngOnInit() {
    this.getShoppingLists();
  }

  getShoppingLists() {
    this.listsSubscription = this.shoppingListsCollection.valueChanges().subscribe((res) => {
      res.forEach(shop => {
        let key = Object.keys(shop.products);
        let products = key.map(productKey => shop.products[productKey]);
        this.shoppingLists.push({
          shopName: shop.shopName,
          products: products
        })
        this.semitransparent[shop.shopName] = [];
        for (var i in key) {
          this.semitransparent[shop.shopName][i] = false;
        }
      });
    })
  }

    /* THIs DOWN HERE WORKS
    // recupero i nomi dei negozi e li metto in listOfShops
    // sottoscrivo la collection con il nome del negozio e spingo i prodotti divisi in liste in arrayOfLists
    // creo un oggetto store: {false, false...} lungo come ogni lista, per controllare la semitraparenza dei prodotti
    this.shoppingShopsDocument
      .valueChanges()
      .subscribe(firestoreShopsProperty => {
        this.listOfShops = Object.keys(firestoreShopsProperty);
        //console.log("listOfShops "+this.listOfShops );
        this.listOfShops.forEach(store => {
          this.listsSubscription = this.shoppingListsCollection.doc("shops").collection(store).valueChanges().subscribe(productsInList => {
              //console.log("productsInList "+productsInList)
              this.arrayOfLists.push(productsInList);
             // console.log("array "+this.arrayOfLists)
              this.semitransparent[store] = [];
              for (var i in productsInList) {
                this.semitransparent[store][i] = false;
              }
            });
        });
      });
    console.log(this.arrayOfLists); */


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
          "Non tutti i prodotti i prodotti della lista risultano presi. Sei sicuro di voler cancellare questa lista? L'operazione è definitiva e i dati non portanno essere recuperati";
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
    this.shoppingLists = [];
    setTimeout(() => {this.showSpinner = false; this.showDeleteModal = false;}, 1000)
  }
    /* THIS DOWN HERE SORTS OF WORKS

    this.listsSubscription.unsubscribe();
    console.log("deleteeeeee");
    var ind = this.listOfShops.indexOf(this.deleteShop);
    var prod = this.arrayOfLists[ind];
    console.log("array of lists "+this.arrayOfLists);
    // 1 - Cancello la lista che c'è in arrayList corrispondende all'index del negozio (prodotti nel template)
    // tolgo dall'array l'elemento che si trova all'indexOf(deleteShop)
    this.arrayOfLists.splice(ind, 1);
    console.log("array of lists spliced"+this.arrayOfLists);

    // 2 - Cancello il nome dello shop da listOfShops (nome del negozio nel template)
    this.listOfShops.splice(ind, 1);

    // 3 - FIRESTORE: cancello il documento con la lista dei negozi: true,
    //     creo un oggetto che abbia key il nome degli shop rimasti e value true
    //     creo tempList perchè ListOfShops torna interno se lo porto dentro then
    var tempShops = this.listOfShops;
    this.shoppingShopsDocument.set({}).then(() => {
      for (var i of tempShops) {
        this.tempListOfShops[i] = true;
      }
    }).then(() => {
      this.shoppingShopsDocument.set(this.tempListOfShops)
    });

    // 4 - FIRESTORE: cancello i documenti dalla lista con nome deleteShop
 */





    // 1 - Cancello su firestore tutti i documenti della lista shop
    /* for( var p of this.arrayOfLists[ind]) {
      console.log(p);
      this.shoppingListsCollection.doc("shops").collection(this.deleteShop).doc(p.id).delete();     } */
    // 3 - Cancello la proprietà con il nome del delete shop da shops/shoplist su firestore
    /* this.shoppingShopsDocument.update({[this.deleteShop]: firebase.firestore.FieldValue.delete()}).then(() => {
      this.listOfShops.splice(ind, 1);
      console.log("property deleted");     }) */

  // 4 - Cancello la proprietà con il nome del negozio da shops/shopList
  // 2 - Cancello il nome dello shop da listOfShops


  /*  // cancello tutti i documenti nella lista con il nome deleteShop
    this.shoppingListsCollection.doc("shops").collection(this.deleteShop).valueChanges().subscribe(product => {
      for (var p of product) {
        this.shoppingListsCollection.doc("shops").collection(this.deleteShop).doc(p.id).delete();
      }
    })

    // cancello la proprietà con il nome deleteShop da shops > shopsLists
    // questa non funziona se non c'è l'import di firebase da firebase/app
    var delShop = this.deleteShop;
    this.shoppingShopsDocument.update({[delShop]: firebase.firestore.FieldValue.delete()}).then(() => {
      this.shopsArray = [];
      this.semitransparent = {};
      this.getShoppingLists()
    })
*/

  ngOnDestroy() {
    this.listsSubscription.unsubscribe();
  }

}
