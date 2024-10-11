import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import _get from "lodash/get";
import EMSApi from '../../utils/Api';
import { RootState } from '../../store/store';

export interface Empployee {
  _id: string;
  username: string;
  email: string;
  fullname: string;     
  phone: string;        
  role: string;         
  experience: number;
  profilePhoto: string;
  company: string;
  dob: string;           
  dept: string;
  doj: string;
  isActive: boolean;
}


const initialState = {
  employeeList: {
    data: null,
    isLoading: false,
    error: null
  }
};

export const getUserList = createAsyncThunk("employee/getUserList", async () => {
  const query = {
    params: {
      role: "employee"
    }
  }
  const res = await EMSApi.user.getUsers(query);
  return _get(res, "data.data");
});


const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserList.pending, (state) => {
      state.employeeList.isLoading = true;
    });
    builder.addCase(getUserList.fulfilled, (state, action) => {
      state.employeeList.isLoading = false;
      state.employeeList.data = action.payload;
    });
    builder.addCase(getUserList.rejected, (state, action) => {
      state.employeeList.isLoading = false;
      state.employeeList.error = action.payload as any;
    })
  }
});

export const employeeState = (state: RootState) => _get(state, "employeeReducer");

export default employeeSlice.reducer;
