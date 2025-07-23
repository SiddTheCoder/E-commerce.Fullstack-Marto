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