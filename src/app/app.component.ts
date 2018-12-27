import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from './services/product.service';
import { Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProduct, Product } from './models/product.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  formProduct: FormGroup;
  name: AbstractControl;
  description: AbstractControl;
  price: AbstractControl;
  stock: AbstractControl;
  productsSub: Subscription;
  product: Product;
  products: Array<Product>;
  constructor(
    private service: ProductService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm(new Product());
    this.getContacts();
  }

  ngOnDestroy(): void {
    if (!!this.productsSub) { this.productsSub.unsubscribe(); }
  }

  createForm(product: Product): void {
    this.formProduct = this.formBuilder.group({
      name: [{ value: product.name, disabled: false }, Validators.required],
      description: [{ value: product.description, disabled: false }, Validators.required],
      price: [{ value: product.price, disabled: false }, Validators.required],
      stock: [{ value: product.stock, disabled: false }, Validators.required]
    });
    this.name = this.formProduct.get('name');
    this.description = this.formProduct.get('description');
    this.price = this.formProduct.get('price');
    this.stock = this.formProduct.get('stock');
  }

  getContacts(): void {
    this.productsSub = this.service.getProducts()
      .subscribe((products: Array<Product>) => {
        this.products = products;
        console.log(products);
      }, (error: any) => {
        console.error(error);
      });
  }

  submit(): void {
    if (this.formProduct.valid) {
      if (!this.product) {
        const newProduct: IProduct = { ...this.formProduct.value };
        this.service.addProduct(new Product(newProduct));
        this.cancel();
      } else {
        const newProduct: IProduct = { ...this.formProduct.value };
        this.service.updateProduct(new Product(newProduct), this.product.id);
        this.cancel();
      }
    }
  }

  updateProduct(index: number): void {
    this.product = new Product({ ...this.products[index] });
    this.createForm(this.product);
  }

  cancel(): void {
    this.createForm(new Product());
    this.product = null;
  }

}
