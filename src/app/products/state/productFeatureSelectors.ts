
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProductState } from "./productReducer";

// Get slice of Store Feature:
const getProductFeatureState = createFeatureSelector<ProductState>('products');

// Get props from SlicedFeature of State:
export const getShowProductCode = createSelector(
    getProductFeatureState,
    state => state.showProductCode
)

export const getCurrentProductId = createSelector(
    getProductFeatureState,
    state => state.currentProductId
)
// Get props from SlicedFeature of State:
export const getCurrentProduct = createSelector(
    getProductFeatureState,
    getCurrentProductId,
    (state, currentProductId) => {
        if (currentProductId == 0) {
            return {
                id: 0,
                productName: '',
                productCode: 'New Product Added',
                description: '',
                starRating: 0
            }
        } else {
            return (currentProductId ? state.products.find((product) => product.id == currentProductId) : null)
        }
    }
)

// Get props from SlicedFeature of State:
export const getProducts = createSelector(
    getProductFeatureState,
    state => state.products
)


// Get props from SlicedFeature of State:
export const getInitializeProduct = createSelector(
    getProductFeatureState,
    state => state.products
)

// GetError
export const getError = createSelector(
    getProductFeatureState,
    state => state.error
)