import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Product } from "../../classes/products/products.class";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";


@Injectable()
export class FireServiceProvider {

  productCollection: AngularFirestoreCollection<Product>;
  productsObservableList: Observable<Product[]>;
  shoppingListsCollection: AngularFirestoreCollection<any>;

             /* ADD MODAL*/ /* showAddModal = false; adding; productForModal; quantity = 1; */
  /* UPDATE PRODUCT MODAL*/ showUpdateProductModal = false; updateAdding; productForUpdateModal;
     /* ADD PRODUCT MODAL*/ showAddProductModal = false; adding; productForAddModal; quantity;

  constructor(public http: HttpClient, private afs: AngularFirestore) {
    this.productCollection = this.afs.collection("products", ref => ref.orderBy('name'));
    this.productsObservableList = this.productCollection.valueChanges()
  }

  // UPDATE - CONVIENE PAGE
  updateProductModal(product, conviene) {
    this.showUpdateProductModal = true;
    this.productForUpdateModal = product;
    if (conviene === 'Si') {
      this.updateAdding = 'sale';
    } else {
      this.updateAdding = 'normal';
    }
  }
  closeUpdateProductModal() {
    this.showUpdateProductModal = false;
    this.updateAdding = 'sale';
  }
  saveUpdatedProduct() {
    var productToUpdate;
    if (this.updateAdding = 'normal') {
      productToUpdate = {
        name: this.productForUpdateModal.name,
        price: this.productForUpdateModal.price,
        shop: this.productForUpdateModal.shop,
      }
    } else if (this.updateAdding = 'sale') {
      productToUpdate = {
        name: this.productForUpdateModal.name,
        priceSale: this.productForUpdateModal.price,
        shopSale: this.productForUpdateModal.shop,
      }
      this.productCollection.doc(this.productForUpdateModal.id).set(productToUpdate);
    }
    this.showUpdateProductModal = false;
    this.showAddProductModal = true;
  }

  addProductToListWithoutUpdating(product) {
    console.log(product);
    this.showUpdateProductModal = false;
    this.showAddProductModal = true;
    this.adding = this.updateAdding;
    this.productForAddModal = product;
    this.quantity = 1;
  }

  addProductToList() {
    var product = this.productForAddModal;
    console.log (product)
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
        this.shoppingListsCollection.doc(product.shopSale).set({
          shopName: product.shopSale,
          products: {
            [product.id]: {
              name: product.name,
              quantity: this.quantity,
              price: product.priceSale,
              sale: true,
              shop: product.shopSale,
              id: product.id
            }
          }},{merge: true});
      }
    /* this.showAddProductModal = false;
    this.adding = '';
    this.updateAdding = ''; */
    this.resetVariables();
  }

  resetVariables() {
    this.showAddProductModal = false;
    this.showUpdateProductModal = false;
    this.adding = '';
    this.updateAdding = '';
    this.quantity = 1;
    this.productForAddModal = {
      name: '',
      price: '',
    };
    this.productForUpdateModal = {
      name: '',
      price: '',
    };
  }


  test() {
    console.log('test');
  }

}
