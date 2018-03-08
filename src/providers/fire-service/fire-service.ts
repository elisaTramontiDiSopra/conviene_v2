import { AuthServiceProvider } from './../auth-service/auth-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Product } from "../../classes/products/products.class";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";


@Injectable()
export class FireServiceProvider {

  productCollection: AngularFirestoreCollection<Product>;
  productsObservableList: Observable<Product[]>;
  shoppingListsCollection: AngularFirestoreCollection<any>;

    /* USER FIRESTORE DB */ productUserCollection: AngularFirestoreCollection<Product>; productsUserObservableList: Observable<Product[]>
    /* USER FIRESTORE DB */ listUserCollection: AngularFirestoreCollection<Product>; listUserObservableList: Observable<Product[]>
             /* ADD MODAL*/ /* showAddModal = false; adding; productForModal; quantity = 1; */
  /* UPDATE PRODUCT MODAL*/ showUpdateProductModal = false; updateAdding; productForUpdateModal;
     /* ADD PRODUCT MODAL*/ showAddProductModal = false; adding; productForAddModal; quantity;
/* ALERT NAME-PRICE MODAL*/ showAlertForNameAndPrice = false;
         /* CURRENT USER */ currentUser

  constructor(public http: HttpClient, private afs: AngularFirestore, public authService: AuthServiceProvider, public storage: Storage) {
    //this.productCollection = this.afs.collection("products", ref => ref.orderBy('name'));
    //this.productsObservableList = this.productCollection.valueChanges()
    this.storage.get('uid').then(localStorageUser => {
      this.currentUser = localStorageUser;
      this.productUserCollection = this.afs.collection('prod-' + this.currentUser, ref => ref.orderBy('name'));
      this.listUserCollection = this.afs.collection('list-' + this.currentUser);
      this.productsUserObservableList = this.productUserCollection.valueChanges();
    });
  }

  // GENERIC
  lowerCase(product) {
    product.name = product.name.toLowerCase();
    product.shop = product.shop.toLowerCase();
    product.shopSale = product.shopSale.toLowerCase();
  }

  // CRUD PRODUCT OPERATIONS - PRODUCT PAGE
  addOrEditProductToDb(product) {
    this.lowerCase(product);
    // se il prodotto non ha un ID vuol dire che non esiste, quindi devo aggiungerlo al DB e tornare alla productPage
    if (!product.id) {
      if (product.name !== '' && (product.price !== null || product.priceSale !== null)) {
        product.id = this.afs.createId();
        this.productUserCollection.doc(product.id).set(product);
        return 'productPage';
      } /* else {
        this.showAlertForNameAndPrice = true;
        console.log("alert");
      } */
      // se il prodotto invece l'ID ce l'ha vuol dire che devo solo aggiornarlo e tornare alla productPage
    } else {
      this.productUserCollection.doc(product.id).set(product);
      return 'productPage';
    }
  }
  deleteProductFromDB(product) {
    this.productUserCollection.doc(product.id).delete();
  }


  // PRODUCT LIST
  addProductToUserList(product, adding, quantity) {
    console.log(product);
    console.log(adding);
    if (product.price === '') {product.price = '???'};
    // add document with the name of the shop and products as property with the id as name property (to avoid copies)
    if (adding === "normal") {

      //aggiungo il prodotto alla collection con il nome del negozio
      this.listUserCollection.doc(product.shop).set({
        shopName: product.shop,
        products: {
          [product.id]: {
            name: product.name,
            quantity: quantity,
            price: product.price,
            sale: false,
            shop: product.shop,
            id: product.id
          }
        }
      }, { merge: true });
    } else if (adding === "sale") {
      //aggiungo il prodotto alla collection con il nome del negozio
      this.listUserCollection.doc(product.shopSale).set({
        shopName: product.shop,
        products: {
          [product.id]: {
            name: product.name,
            quantity: quantity,
            price: product.price,
            sale: true,
            shop: product.shopSale,
            id: product.id
          }
        }
      }, { merge: true });
    }
  }


  // CRUD OPERATIONS - SHOPPING LIST



  //BUTTONS FUNCTIONS
  /*
   delete() {
     this.product = { name: '', img: '', price: null, unity: 'kilo', shop: '', priceSale: '', shopSale: '', unitySale: 'kilo', id: '' };
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
     this.section = 'editProductPage';
   }
  */













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
        name: this.productForUpdateModal.name.lowerCase(),
        price: this.productForUpdateModal.price,
        shop: this.productForUpdateModal.shop.lowerCase(),
      }
    } else if (this.updateAdding = 'sale') {
      productToUpdate = {
        name: this.productForUpdateModal.name.lowerCase(),
        priceSale: this.productForUpdateModal.price,
        shopSale: this.productForUpdateModal.shop.lowerCase(),
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
    console.log(product)
    // add document with the name of the shop and products as property with the id as name property (to avoid copies)
    this.shoppingListsCollection = this.afs.collection("lists");
    if (this.adding === "normal") {
      //aggiungo il prodotto alla collection con il nome del negozio
      this.shoppingListsCollection.doc(product.shop).set({
        shopName: product.shop.lowerCase(),
        products: {
          [product.id]: {
            name: product.name.lowerCase(),
            quantity: this.quantity,
            price: product.price,
            sale: false,
            shop: product.shop.lowerCase(),
            id: product.id
          }
        }
      }, { merge: true });
    } else if (this.adding === "sale") {
      //aggiungo il prodotto alla collection con il nome del negozio
      this.shoppingListsCollection.doc(product.shopSale).set({
        shopName: product.shopSale.lowerCase(),
        products: {
          [product.id]: {
            name: product.name.lowerCase(),
            quantity: this.quantity,
            price: product.priceSale,
            sale: true,
            shop: product.shopSale.lowerCase(),
            id: product.id
          }
        }
      }, { merge: true });
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
