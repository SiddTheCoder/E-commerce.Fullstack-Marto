import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { setUser,setError,setLoading ,setUserChecked} from "./userSlice";

export const getCurrentUser = createAsyncThunk(
    'user/getCurrentUser',
    async(_,{dispatch,rejectWithValue}) => {
        try {
            dispatch(setLoading(true))
            const response = await axiosInstance.get('/user/get-current-user')
            dispatch(setUser(response.data.data.user))
            return response.data.data;
            
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        } finally {
            dispatch(setLoading(false))
            dispatch(setUserChecked(true))
        }
    }
)