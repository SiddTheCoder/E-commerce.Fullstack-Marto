import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setProducts,
  setCurrentProduct,
  setLoading,
  setError,
  setSuccess,
  setFilteredProducts,
} from "./productSlice";
import { setCurrentStoreProducts } from "../store/storeSlice";
import axiosInstance from "../../utils/axiosInstance";

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.post(
        "/product/create-product",
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Product Created", response);
      console.log(response.data.data);

      const createdProduct = response.data.data;
      const { products } = getState().product;
      const { currentStore } = getState().store;

      // 🔧 Create a new array instead of mutating state
      const updatedProducts = [createdProduct, ...products];
      dispatch(setProducts(updatedProducts));
      dispatch(
        setCurrentStoreProducts([createdProduct, ...currentStore.products])
      );
      return createdProduct;
    } catch (error) {
      console.log("err at geting store", error);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Error occurred while fetching the stores"
        )
      );
      return rejectWithValue(error.response?.data || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.get("/product/get-all-products");
      const { cartProducts } = getState().cart;
      // console.log("Cart Product before fetchig yhe normal prod", cartProducts)
      // console.log("All Products", response.data.data);
      dispatch(setProducts(response.data.data, ...cartProducts));

      return response.data.data;
    } catch (error) {
      console.log("err at geting products", error);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Error occurred while fetching the products"
        )
      );
      return rejectWithValue(error.response?.data || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getFilteredProducts = createAsyncThunk(
  "product/getFilteredProducts",
  async (filter, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.get(
        "/product/get-filtered-products",
        {
          params: filter,
        }
      );

      console.log("Filtered Products", response.data.data);
      dispatch(setFilteredProducts(response.data.data.products));

      return response.data.data;
    } catch (error) {
      console.log("err at getting filtered products", error);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Error occurred while fetching the filtered products"
        )
      );
      return rejectWithValue(error.response?.data || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/product/get-product-by-id?productId=${id}`
      );

      console.log("Product By Id", response.data.data);
      dispatch(setCurrentProduct(response.data.data));

      return response.data.data;
    } catch (error) {
      console.log("err at getting product by id", error);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Error occurred while fetching the product by id"
        )
      );
      return rejectWithValue(error.response?.data || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);
