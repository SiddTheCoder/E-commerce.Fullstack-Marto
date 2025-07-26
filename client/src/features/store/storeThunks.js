import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import {
  setStores,
  setCurrentStore,
  clearStoreState,
  setLoading,
  setError,
  setHasFetched,
  setCurrentStoreProducts
} from "./storeSlice";
import { useSelector } from "react-redux";
import { setProducts } from "../product/productSlice";

export const getAllStores = createAsyncThunk(
  "store/getAllStores",
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.get("/store/get-all-stores");
      const stores = response.data.data;
      console.log("Stores", stores);

      dispatch(setStores(stores));
      dispatch(setHasFetched(true));

      // Try to restore previously selected store from localStorage
      const storedId = localStorage.getItem("selectedStoreId");
      const matchedStore = stores.find((store) => store._id === storedId);

      if (matchedStore) {
        dispatch(setCurrentStore(matchedStore));
      } else {
        dispatch(setCurrentStore(stores[0])); // fallback to first store
        localStorage.setItem("selectedStoreId", stores[0]?._id);
      }

      return stores;
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

export const getCurrentStoreProducts = createAsyncThunk(
  "store/getCurrentStoreProducts",
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(setLoading(true));

      const { currentStore } = getState().store
      
      const products = currentStore?.products || [];
      console.log("Current Store Products", products);
      dispatch(setCurrentStoreProducts(products));

      return products;
    } catch (error) {
      console.log("err at getting current store products", error);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Error occurred while fetching the current store products"
        )
      );
      return rejectWithValue(error.response?.data || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
)

export const createStore = createAsyncThunk(
  "store/createStore",
  async (storeData, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.post(
        "/store/create-store",
        storeData
      );
      const createdStore = response.data.data;
      const { stores = [] } = getState().store; // ✅ Correct way to access current store state

      const newStores = [...stores, createdStore];
      dispatch(setStores(newStores));
      dispatch(setHasFetched(true));
      dispatch(setCurrentStore(createdStore));
      localStorage.setItem("selectedStoreId", createdStore._id);
      dispatch(setProducts(createdStore?.products || []));

      return createdStore;
    } catch (error) {
      console.log("err at creating store", error);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Error occurred while creating the store"
        )
      );
      return rejectWithValue(error.response?.data || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getStoreById = createAsyncThunk(
  "store/getStoreById",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get(
        `/store/get-store-by-id?storeId=${id}`
      );
      const store = response.data.data;
      // console.log("Store By Id", store);
      dispatch(setCurrentStore(store));

      return store;
    } catch (error) {
      console.log("err at getting store by id", error);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Error occurred while fetching the store"
        )
      );
      return rejectWithValue(error.response?.data || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const toggleStoreLike = createAsyncThunk(
  "store/likeStore",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.post(
        `/store/like-store?storeId=${id}`
      );
      const store = response.data.data;
      dispatch(setCurrentStore(store));

      return store;
    } catch (error) {
      console.log("err at liking store by id", error);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Error occurred while liking the store"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  }
);
