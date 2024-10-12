import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import _get from "lodash/get";
import EMSApi from '../../utils/Api';
import { RootState } from '../../store/store';
import { Empployee } from '../employee/employeeSlice';

interface UserState {
  isLoading: boolean;
  data: null | Empployee; 
  error: null | string;
}

const initialState = {
  user: {
    isLoading: false,
    data: null,
    error: null,
  } as UserState
};

export const fetchUser = createAsyncThunk<Empployee, void, { rejectValue: string }>("home/fetchUser", async () => {
  const res = await EMSApi.user.getUserDetails();
  return _get(res, "data.data");
})

const itemsSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.user.isLoading = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user.isLoading = false;
      state.user.data = action.payload;
    });
    builder.addCase(fetchUser.rejected, (state,action) => {
      state.user.isLoading = false;
      state.user.error = action.payload as string;
    })
  }
});

export const homeState = (state: RootState) => _get(state, "homeReducer.user");

export default itemsSlice.reducer;
