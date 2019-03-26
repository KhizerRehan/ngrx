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
        tap(() => console.log('@ProductsEffects')),
        mergeMap(action =>
            this.productService.getProducts().pipe(
                map((products: Product[]) => new ProductActionsCreators.LoadSuccess(products)),
                catchError(err => of(new ProductActionsCreators.LoadFail(err)))
            )
        )
    )

}