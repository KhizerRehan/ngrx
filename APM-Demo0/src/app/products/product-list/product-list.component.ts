import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';

// NGRX:
import * as fromProduct from '../state/productReducer';
import * as fromProductFeatureSelector from '../state/productFeatureSelectors';
import * as ProductActionsCreators from '../state/productActionCreators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  errorMessage: string;

  displayCode: boolean;

  products: Product[];

  // Used to highlight the selected product in the list
  selectedProduct: Product | null;
  sub: Subscription;

  constructor(private store: Store<fromProduct.AppState>,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.sub = this.productService.selectedProductChanges$.subscribe(
      selectedProduct => this.selectedProduct = selectedProduct
    );

    // this.productService.getProducts().subscribe(
    //   (products: Product[]) => this.products = products,
    //   (err: any) => this.errorMessage = err.error
    // );

    // SHOW PRODUCT CODE:
    this.store.pipe(
      select(fromProductFeatureSelector.getShowProductCode),
      tap((val) => console.log("Store Val", val)))
      .subscribe((showProductCode: boolean) => {
        console.log('Retrievced SubSlice of a Product Slice', showProductCode);
        this.displayCode = showProductCode
      })



    //  SELECT CURRENT PRODUCT:
    this.store.pipe(
      select(fromProductFeatureSelector.getCurrentProduct),
      tap((currentProduct) => console.log("Current Product", currentProduct)))
      .subscribe((currentProduct: Product) => {

        this.selectedProduct = currentProduct;
      })


  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  checkChanged(value: boolean): void {
    // this.displayCode = value;
    const actionCreatorDispatcher = new ProductActionsCreators.ToggleProductCode(value);
    this.store.dispatch(actionCreatorDispatcher);
  }

  newProduct(): void {
    // this.productService.changeSelectedProduct(this.productService.newProduct());
    const actionCreatorDispatcher = new ProductActionsCreators.InitializeCurrentProduct();
    this.store.dispatch(actionCreatorDispatcher);
  }

  productSelected(product: Product): void {
    // this.productService.changeSelectedProduct(product);
    const setCurrentProductDispatcher = new ProductActionsCreators.SetCurrentProduct(product);
    this.store.dispatch(setCurrentProductDispatcher);
  }

}
