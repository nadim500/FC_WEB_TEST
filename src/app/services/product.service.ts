import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { IProduct, Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productsCollections: AngularFirestoreCollection<IProduct>;
  products: Observable<Array<Product>>;
  constructor(
    private firebaseService: AngularFirestore
  ) {
    this.productsCollections = firebaseService.collection<Product>('products');
    this.products = this.productsCollections
      .snapshotChanges()
      .pipe(
        map((actions: Array<DocumentChangeAction<IProduct>>) =>
          actions.map((a: DocumentChangeAction<IProduct>) => {
            const data = a.payload.doc.data() as IProduct;
            const id = a.payload.doc.id;
            return new Product({ id, ...data });
          }))
      );
  }

  getProducts(): Observable<Array<Product>> {
    return this.products;
  }

  addProduct(product: Product): void {
    delete product.id;
    const newProduct = { ...product } as IProduct;
    this.productsCollections.add(newProduct);
  }

  updateProduct(product: Product, id: string): void {
    delete product.id;
    const updateProduct = { ...product } as IProduct;
    console.log(updateProduct);
    const task = this.firebaseService.doc<IProduct>(`products/${id}`);
    task.update(updateProduct);
  }
}
