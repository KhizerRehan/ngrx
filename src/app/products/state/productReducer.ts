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
    currentProductId: number | null,
    products: Product[],
    error: string
}

const InitialProductState: ProductState = {
    showProductCode: true,
    currentProductId: null,
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
                currentProductId: actionToPerform.payload.id
            };

        case ProductActionTypes.ClearCurrentProduct:
            return {
                ...prevState,
                currentProductId: null
            };
        case ProductActionTypes.InitializeCurrentProduct:
            return {
                ...prevState,
                currentProductId: 0
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

        case ProductActionTypes.UpdateProductSuccess:
            const updatedProducts = prevState.products.map(
                item => actionToPerform.payload.id === item.id ? actionToPerform.payload : item);
            return {
                ...prevState,
                products: updatedProducts,
                currentProductId: actionToPerform.payload.id,
                error: ''
            };

        case ProductActionTypes.UpdateProductFail:
            return {
                ...prevState,
                error: actionToPerform.payload
            };

        case ProductActionTypes.DeleteProductSuccess: 
         return {
             ...prevState,
             products: prevState.products.filter((prod:Product) => prod.id == actionToPerform.payload),
             error:''
         }

         case ProductActionTypes.DeleteProductFail:
         return {
            ...prevState,
                error:actionToPerform.payload
            }

            case ProductActionTypes.CreateProductSuccess:
            return {
               ...prevState,
               products: [...prevState.products, actionToPerform.payload],
               currentProductId: actionToPerform.payload.id,
               error: ''
            }
            case ProductActionTypes.CreateProductFail:
            return {
                ...prevState,
                error:actionToPerform.payload
            }
        default:
            return prevState;
    }
}