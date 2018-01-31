import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Product } from "../../classes/products/products.class";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    //recupero i nomi dei negozi, sottoscrivo la collection con il nome del negozio e recupero i prodotti
    //spingo in shopsArray l'oggetto con il nome del negozio e i prodotti
    this.shoppingListsCollection = this.afs.collection("lists");
    this.shoppingShopsDocument = this.afs.collection("shops").doc("shopLists");
    this.shoppingShopsDocument.valueChanges().subscribe(res => {
      for (let key in res) {
        this.shoppingListsCollection.doc("shops").collection(key).valueChanges().subscribe(r => {
          this.shopsArray.push({
            name: key,
            products: r
          });
          //riempio l'array semitransparent di un false per ogni prodotto della lista negozio
          //per poter poi rendere semitrasparente il prodotto al clic della X nel template
          for (let i=0; i<r.length; i++) {
            this.semitransparent[key] = {[i]: false}
          }
        });
      }
    });
    console.log(this.semitransparent);
  }

  transp(shop, i){
    this.semitransparent[shop][i] = true
    console.log(this.semitransparent);
  }
}
