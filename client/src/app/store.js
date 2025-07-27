import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'
import localStateReducer from '../features/localState/localStateSlice';
import storeReducer from '../features/store/storeSlice'
import productReducer from '../features/product/productSlice'
import wishListProductReducer from '../features/wishList/wishListSlice'
import cartReducer from '../features/cart/cartSlice'
import orderReducer from '../features/order/orderSlice'
import dashboardReducer from '../features/dashboard/dashboardSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    localState: localStateReducer,
    store: storeReducer,
    product: productReducer,
    wishListProduct: wishListProductReducer,
    cart: cartReducer,
    order: orderReducer,
    dashboard: dashboardReducer,
  },
})
