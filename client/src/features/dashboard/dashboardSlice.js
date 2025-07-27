import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  dashboardOrderedProducts : [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardOrderedProducts: (state, action) => {
      state.dashboardOrderedProducts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export default dashboardSlice.reducer;

export const { setDashboardOrderedProducts, setLoading, setError} = dashboardSlice.actions;