import { Product } from "../product";
import * as fromRoot from '../../state/app.state';
import { ProductActionTypes } from "./productActionTypes";
import { ProductActionsCreators } from "./productActionCreators";


// Extend the AppState to avoid breakage of LazyLoading Barrier:
// Thus this represents entire state tree
export interface AppState extends fromRoot.AppState {
    products: ProductState
}

export interface ProductState {
    showProductCode: boolean,
    currentProduct: Product,
    products: Product[],
    error: string
}

const InitialProductState: ProductState = {
    showProductCode: true,
    currentProduct: null,
    products: [],
    error: ''
}


// ====================================

export function productReducer(prevState: ProductState = InitialProductState, actionToPerform: ProductActionsCreators): ProductState {
 
    switch (actionToPerform.type) {

        case ProductActionTypes.ToggleProductCode:
            return {
                ...prevState,
                showProductCode: actionToPerform.payload
            };
        case ProductActionTypes.SetCurrentProduct:
            return {
                ...prevState,
                currentProduct: { ...actionToPerform.payload }
            };

        case ProductActionTypes.ClearCurrentProduct:
            return {
                ...prevState,
                currentProduct: null
            };
        case ProductActionTypes.InitializeCurrentProduct:
            return {
                ...prevState,
                currentProduct: {
                    id: 0,
                    productName: '',
                    productCode: 'New Product Added',
                    description: '',
                    starRating: 0
                }
            };
        case ProductActionTypes.LoadSuccess: 
         return {
             ...prevState,
             products: actionToPerform.payload,
             error: ''
         }
         case ProductActionTypes.LoadFail: 
         return {
             ...prevState,
             products: [],
             error: actionToPerform.payload
         }
        default:
            return prevState;
    }
}