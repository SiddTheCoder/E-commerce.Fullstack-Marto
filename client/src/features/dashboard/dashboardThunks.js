import axiosInstance from "../../utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setDashboardOrderedProducts } from "./dashboardSlice";

export const getDashboardOrderedProducts = createAsyncThunk(
  "dashboard/getDashboardOrderedProducts",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/dashboard/get-dashboard-ordered-products"
      );
      console.log("Dashboard Ordered Products", response.data.data);
      dispatch(setDashboardOrderedProducts(response.data.data));
      return response.data.data;
    } catch (error) {
      console.log("err at getting dashboard ordered products", error);
      return rejectWithValue(error.response?.data || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);
