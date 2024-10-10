import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import _get from "lodash/get";
import EMSApi from '../../utils/Api';
import { RootState } from '../../store/store';

interface UserState {
  isLoading: boolean;
  data: null | any; 
  error: null | string;
}

interface WorkspaceState {
  isLoading: boolean;
  workspacedata: null | any; 
  error: null | string;
}

interface UserDetails {
  id: string;
  username: string;
  email: string;
  fullname: string;
  // Add other user properties as necessary
}
interface Workspaces {
  id: string;
  name: string;
  email: string;
  logo: string;
  // Add other user properties as necessary
}

const initialState = {
  user: {
    isLoading: false,
    data: null,
    error: null,
  } as UserState,
  workspaces: {
    workspacedata: null,
    isLoading: false,
    error: null,
  } as WorkspaceState,
  workspaceAdmin: {
    
  }
};

export const fetchUser = createAsyncThunk<UserDetails, void, { rejectValue: string }>("home/fetchUser", async () => {
  const res = await EMSApi.user.getUserDetails();
  return _get(res, "data.data") as any;
});

export const getWorkspaces = createAsyncThunk<Workspaces, void, { rejectValue: string }>("home/getWorkspaces", async () => {
  const res = await EMSApi.workspace.get();
  console.log("ccccc", res);
  
  return _get(res,"data.data") as any;
});

export const getWorkspaceAdmins = createAsyncThunk<Workspaces, void, { rejectValue: string }>("home/getWorkspaces", async (qr, state) => {
  console.log("Aaaa", state);
  
  const query = {
    role: "workspace_admin",
    // superAdminId: 
  }
  const res = await EMSApi.user.getUsers();
  console.log("ccccc", res);
  
  return _get(res,"data.data") as any;
});

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
    });
    builder.addCase(getWorkspaces.pending, (state) => {
      state.workspaces.isLoading = true;
    });
    builder.addCase(getWorkspaces.fulfilled, (state, action) => {
      state.workspaces.isLoading = false;
      state.workspaces.workspacedata = action.payload;
    });
    builder.addCase(getWorkspaces.rejected, (state,action) => {
      state.workspaces.isLoading = false;
      state.workspaces.error = action.payload as any;
    });
    builder.addCase(getWorkspaceAdmins.pending, (state) => {
      state. = true;
    });
    builder.addCase(getWorkspaceAdmins.fulfilled, (state, action) => {
      state.workspaces.isLoading = false;
      state.workspaces.workspacedata = action.payload;
    });
    builder.addCase(getWorkspaceAdmins.rejected, (state,action) => {
      state.workspaces.isLoading = false;
      state.workspaces.error = action.payload as any;
    });
  }
});

export const homeState = (state: RootState) => _get(state, "homeReducer.user");
export const workspaceState = (state: RootState) => _get(state, "homeReducer.workspaces");

export default itemsSlice.reducer;
