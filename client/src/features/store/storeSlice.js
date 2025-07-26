import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stores: [],
  currentStore: null,
  currentStoreProducts: [],
  loading: false,
  error: null,
  success: null,
  hasFetched : false
}

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setStores: (state, action) => {
      state.stores = action.payload
    },
    setCurrentStore : (state, action) => {
      state.currentStore = action.payload
    },
    setCurrentStoreProducts : (state, action) => {
      state.currentStoreProducts = action.payload
    },
    clearStoreState: (state) => {
      state.currentStore = null;
      state.loading = false;
      state.error = null;
      state.success = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setHasFetched: (state, action) => {
      state.hasFetched = action.payload;
    },
  }
})

export const { setStores, setCurrentStoreProducts, setCurrentStore, clearStoreState, setLoading, setError, setHasFetched } = storeSlice.actions

export default storeSlice.reducer