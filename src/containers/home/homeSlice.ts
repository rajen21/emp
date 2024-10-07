import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import _get from "lodash/get";
import EMSApi from '../../utils/Api';
import { RootState } from '../../store/store';

interface UserState {
  isLoading: boolean;
  data: null | any; 
  error: null | string;
}

interface UserDetails {
  id: string;
  username: string;
  email: string;
  fullname: string;
  // Add other user properties as necessary
}

const initialState = {
  user: {
    isLoading: false,
    data: null,
    error: null,
  } as UserState
};

export const fetchUser = createAsyncThunk<UserDetails, void, { rejectValue: string }>("home/fetchUser", async () => {
  const res = await EMSApi.user.getUserDetails();
  return _get(res, "data.data") as any;
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
