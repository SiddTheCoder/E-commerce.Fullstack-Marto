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
  "order/placeOrder",
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInsance.post("/order/place-order", orderData);
      console.log("Data fetchec while placeing order", response.data.data);
      return response.data.data;
    } catch (error) {
      console.log("Error occured while placeing order", error);
      return rejectWithValue(error.response?.data || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getConsumerAllOrders = createAsyncThunk(
  "order/getConsumerAllOrders",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInsance.get("/order/get-consumer-all-orders");
      console.log(
        "Data fetchec while getting consumer all orders",
        response.data.data
      );
      dispatch(setOrders(response.data.data));
      dispatch(setCartProducts([]));
      dispatch(setCartProductsLength(0));
      return response.data.data;
    } catch (error) {
      console.log("Error occured while getting consumer all orders", error);
      return rejectWithValue(error.response?.data || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getSellerAllOrders = createAsyncThunk(
  "order/getSellerAllOrders",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInsance.get("/order/get-seller-all-orders");
      console.log(
        "Data fetchec while getting seller all orders",
        response.data.data
      );
      dispatch(setOrders(response.data.data));
      return response.data.data;
    } catch (error) {
      console.log("Error occured while getting seller all orders", error);
      return rejectWithValue(error.response?.data || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const cancelOrderViaConsumer = createAsyncThunk(
  "order/cancelOrderViaConsumer",
  async ({ orderId, productId }, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(setLoading(true));
      console.log("orderId", orderId, "productId", productId);

      const response = await axiosInsance.post(
        "/order/cancel-order-via-consumer",
        { orderId, productId }
      );
  
      const { orders } = getState().order;
     
      const updatedOrders = orders
        .map((order) => {
          if (order._id.toString() === orderId.toString()) {
            const updatedProducts = order.products.filter((item) => {
              console.log("product._id", item.product._id);
              console.log("productId", productId);
              return item.product._id.toString() !== productId.toString();
            });

            if (updatedProducts.length === 0) {
              // Return null to indicate this order should be removed entirely
              return null;
            }

            return {
              ...order,
              products: updatedProducts,
            };
          }

          return order;
        })
        .filter((order) => order !== null); // Remove deleted orders

      dispatch(setOrders(updatedOrders));
      return response.data.data;
    } catch (error) {
      console.log("Error occurred while canceling order via consumer", error);
      return rejectWithValue(error.response?.data || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);
