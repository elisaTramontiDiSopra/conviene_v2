import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Product } from "../../classes/products/products.class";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: "page-list-shopping",
  templateUrl: "list-shopping.html"
})
export class ListShoppingPage {
  shoppingListsCollection: AngularFirestoreCollection<any>;
  shoppingListsObservable: Observable<any[]>;
  shoppingShopsDocument: AngularFirestoreDocument<any>;
  shopsArray = [];
  shopsListTotalMoney = []
  colorsArray = ['purple', 'orange', 'blue'];

  semitransparent = {};
  /* MODAL VAR */
  showDeleteModal = false; deleteMessage = ''; secureDelete; deleteShop; productIds;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
    this.shoppingListsCollection = this.afs.collection("lists");
    this.shoppingShopsDocument = this.afs.collection("shops").doc("shopLists");
  }

  ngOnInit() {
    this.getShoppingLists();
  }

  getShoppingLists() {
    //recupero i nomi dei negozi, sottoscrivo la collection con il nome del negozio e recupero i prodotti
    //spingo in shopsArray l'oggetto con il nome del negozio e i prodotti
    this.shoppingShopsDocument.valueChanges().subscribe(res => {
      for (let key in res) {
        this.shoppingListsCollection.doc("shops").collection(key).valueChanges().subscribe(r => {
          this.shopsArray.push({
            name: key,
            products: r
          });
          // riempio l'array semitransparent di un false per ogni prodotto della lista negozio
          // per poter poi rendere semitrasparente il prodotto al clic della X nel template
          for (let i=0; i<r.length; i++) {
            this.semitransparent[key] = {[i]: false}
          }
        });
      }
    });
  }

  transp(shop, i){
    this.semitransparent[shop][i] = !this.semitransparent[shop][i]
    console.log(this.semitransparent);
  }

  showDeleteModalConfirmation(shop) {
    this.deleteShop = shop;
    // controllo se tutti i prodotti sono stati segnati come presi (trasparent)
    // se ci sono ancora prodotti non cancellati visualizzo un messaggio di avviso
    // e imposto la variabile (per css e template) che segnali il pericolo cancellazione accidentale
    for (var product in this.semitransparent[shop]) {
      console.log(this.semitransparent[shop][product]);
      this.showDeleteModal = true;
      if (this.semitransparent[shop][product] === false) {
        this.secureDelete = false;
        this.deleteMessage = "Non tutti i prodotti i prodotti della lista risultano presi. Sei sicuro di voler cancellare questa lista? L'operazione è definitiva e i dati non portanno essere recuperati";
      } else {
        this.secureDelete = true;
        this.deleteMessage = "Confermi di voler cancellare questa lista della spesa?";
      }
    }
  }

  deleteList() {
    console.log("deleteeeeee");
    // cancello tutti i documenti nella lista con il nome deleteShop
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

    //cancello dall'array che mi ha fatto costruire il template

  }

}
