import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { Store, select } from '@ngrx/store';
import { tap, takeWhile } from 'rxjs/operators';

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
  errorMessage$: any;
  componentActive: boolean = true; // To Keep Alive Subscription

  constructor(private store: Store<fromProduct.AppState>,
    private productService: ProductService) { }

  ngOnInit(): void {

    // this.sub = this.productService.selectedProductChanges$.subscribe(
    //   selectedProduct => this.selectedProduct = selectedProduct
    // );

    // this.productService.getProducts().subscribe(
    //   (products: Product[]) => this.products = products,
    //   (err: any) => this.errorMessage = err.error
    // );

    // Do NOT subscribe here because it used an async pipe:
    this.errorMessage$ = this.store.pipe(select(fromProductFeatureSelector.getError));

    this.store.dispatch(new ProductActionsCreators.Load())
  

    //  SELECT_CURRENT_PRODUCT:
    this.store.pipe(
      select(fromProductFeatureSelector.getCurrentProduct),
      tap((currentProduct) => console.log("Current Product", currentProduct)),
      takeWhile(() => this.componentActive))
      .subscribe((currentProduct: Product) => {
        this.selectedProduct = currentProduct;
      })

    //  GET_PRODUCTS
    // Subscribe here because it does not use an async pipe
    this.store.pipe(
      select(fromProductFeatureSelector.getProducts),
      tap((val) => console.log('@Ngrx/Effexts Working  Products loading Async', val)),
      takeWhile(() => this.componentActive)
    ).subscribe((products: Product[]) => {
      this.products = products;
    })

    // SHOW_PRODUCT_CODE:
    this.store.pipe(
      select(fromProductFeatureSelector.getShowProductCode),
      tap((val) => console.log("Store Val", val)),
      takeWhile(() => this.componentActive))
      .subscribe((showProductCode: boolean) => {
        console.log('Retrievced SubSlice of a Product Slice', showProductCode);
        this.displayCode = showProductCode
      })

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.componentActive = false;
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
