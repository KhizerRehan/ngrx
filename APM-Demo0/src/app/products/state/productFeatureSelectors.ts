
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProductState } from "./productReducer";

// Get slice of Store Feature:
const getProductFeatureState = createFeatureSelector<ProductState>('products');

// Get props from SlicedFeature of State:
export const getShowProductCode = createSelector(
    getProductFeatureState,
    state => state.showProductCode
)

// Get props from SlicedFeature of State:
export const getCurrentProduct = createSelector(
    getProductFeatureState,
    state => state.currentProduct
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