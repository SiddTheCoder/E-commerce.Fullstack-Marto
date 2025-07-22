import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  currentProduct: null,
  loading: false,
  error: null,
  success: null,
  filteredProducts: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload;
    },
  },
});

export const {
  setOrders,
  setCurrentProduct,
  setLoading,
  setError,
  setSuccess,
  setFilteredProducts,
} = orderSlice.actions;

export default orderSlice.reducer;
