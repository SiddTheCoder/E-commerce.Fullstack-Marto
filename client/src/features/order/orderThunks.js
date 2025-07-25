import axiosInsance from "../../utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setOrders,
  setOrderedProducts,
  setLoading,
  setError,
  setSuccess,
  setFilteredProducts,
} from "./orderSlice";

import { setCartProducts, setCartProductsLength } from "../cart/cartSlice";

// interface ProductData {
//   productId: string;
//   sellerId: string;
//   quantity: number;
// }

// interface BODY__FOR__PLACE__ORDER(orderData) {
//   productData: ProductData[];
//   paymentMethod: string;
//   totalAmount: number;
//   fromCart: Boolean;
// }

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      const response = await axiosInsance.post('/order/place-order', orderData)
      console.log(
        'Data fetchec while placeing order',
        response.data.data
      )
      return response.data.data
    } catch (error) {
      console.log(
        'Error occured while placeing order',
        error
      )
      return rejectWithValue(error.response?.data || error.message)
    } finally {
      dispatch(setLoading(false))
    }
  }
)

export const getConsumerAllOrders = createAsyncThunk(
  'order/getConsumerAllOrders',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      const response = await axiosInsance.get('/order/get-consumer-all-orders')
      console.log(
        'Data fetchec while getting consumer all orders',
        response.data.data
      )
      dispatch(setOrders(response.data.data))
      dispatch(setCartProducts([]))
      dispatch(setCartProductsLength(0))
      return response.data.data
    } catch (error) {
      console.log(
        'Error occured while getting consumer all orders',
        error
      )
      return rejectWithValue(error.response?.data || error.message)
    } finally {
      dispatch(setLoading(false))
    }
  }
)

export const getSellerAllOrders = createAsyncThunk(
  'order/getSellerAllOrders',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      const response = await axiosInsance.get('/order/get-seller-all-orders')
      console.log(
        'Data fetchec while getting seller all orders',
        response.data.data
      )
      dispatch(setOrders(response.data.data))
      return response.data.data
    } catch (error) {
      console.log(
        'Error occured while getting seller all orders',
        error
      )
      return rejectWithValue(error.response?.data || error.message)
    } finally {
      dispatch(setLoading(false))
    }
  }
)