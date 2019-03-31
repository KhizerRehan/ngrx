import { Injectable } from "@angular/core";

import { Observable, of } from 'rxjs';
import { mergeMap, catchError, map, tap } from 'rxjs/operators'
import { ProductService } from "../../product.service";

// @NgRX
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { ProductActionTypes } from "../productActionTypes";
import * as ProductActionsCreators from '../productActionCreators';
import { Product } from "../../product";


@Injectable()
export class ProductsEffects {

    constructor(private productService: ProductService, private actions$: Actions) {
    }

    @Effect()
    loadProducts$: Observable<Action> = this.actions$.pipe(
        ofType(ProductActionTypes.Load),
        tap(() => console.log('@ProductsEffects loadProducts$')),
        mergeMap(action =>
            this.productService.getProducts().pipe(
                map((products: Product[]) => new ProductActionsCreators.LoadSuccess(products)),
                catchError(err => of(new ProductActionsCreators.LoadFail(err)))
            )
        )
    );

    @Effect()
    updateProduct$: Observable<Action> = this.actions$.pipe(
        ofType(ProductActionTypes.UpdateProduct),
        tap(() => console.log('@ProductsEffects updateProduct$')),
        map((action: ProductActionsCreators.UpdateProduct) => action.payload ),
        mergeMap((product: Product) => 
            this.productService.updateProduct(product).pipe(
                map(product => new ProductActionsCreators.UpdateProductSuccess(product) ),
                catchError((err) => of(new ProductActionsCreators.UpdateProductFail(err)))
            )
        )
    )
    

    @Effect()
    createProduct$: Observable<Action> = this.actions$.pipe(
        ofType(ProductActionTypes.CreateProduct),
        tap(()=>console.log('CREATE Product Action')),
        map((action: ProductActionsCreators.CreateProduct) => action.payload),
        mergeMap((product:Product) =>
             this.productService.createProduct(product).pipe(
                map((newProduct) => (new ProductActionsCreators.CreateProductSuccess(newProduct))),
                catchError((err) => of(new ProductActionsCreators.CreateProductFail(err)))
            )
        )
    )

    @Effect()
    deleteProduct$: Observable<Action> = this.actions$.pipe(
        ofType(ProductActionTypes.DeleteProduct),
        tap(()=>console.log('DELETE Product Action')),
        map((action: ProductActionsCreators.DeleteProduct) => action.payload),
        mergeMap((productId:number) =>
             this.productService.deleteProduct(productId).pipe(
                map(() => new ProductActionsCreators.DeleteProductSuccess(productId)),
                catchError((err) => of(new ProductActionsCreators.DeleteProductFail(err)))
            )
        )
    )
}