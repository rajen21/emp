import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import _get from "lodash/get";
import EMSApi from '../../utils/Api';
import { RootState } from '../../store/store';

interface UserState {
  isLoading: boolean;
  data: UserDetails | UserDetails[] | null; 
  error: string | undefined;
}

interface WorkspaceState {
  isLoading: boolean;
  workspacedata: Workspaces[] | null; 
  error: string | undefined;
}

interface UserDetails {
  username: string;
  email: string;
  fullname: string;
  role: string;
  experience: number;
  isActive: boolean;
  profilePhoto?: string;
  company?: string;
  address?: string;
  dob?: string;
  dept?: string;
  phone?: string;
  doj?: string;
  company_address?: string;
  workspaceId?: object;
  superAdminId?: object;
  workSpaceAdminId?:object;
}
export interface Workspaces {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  owner: string;  
  admin: string;  
  isActive: boolean;
}

const initialState = {
  user: {
    isLoading: false,
    data: null,
    error: undefined,
  } as UserState,
  workspaces: {
    workspacedata: null,
    isLoading: false,
    error: undefined,
  } as WorkspaceState,
  workspaceAdmins: {
    isLoading: false,
    error: undefined,
    data: null,
  } as UserState,
};

export const fetchUser = createAsyncThunk<UserDetails, void, { rejectValue: string }>("home/fetchUser", async () => {
  const res = await EMSApi.user.getUserDetails();
  return _get(res, "data.data") as UserDetails;
});

export const getWorkspaces = createAsyncThunk<Workspaces[], void, { rejectValue: string }>("home/getWorkspaces", async () => {
  const res = await EMSApi.workspace.get();
  return _get(res,"data.data") as Workspaces[];
});

export const getWorkspaceAdmins = createAsyncThunk<UserDetails[], void, { rejectValue: string }>("home/getWorkspaceAdmins", async () => {
  const query = {
    params: {
      role: "workspace_admin",
    }
  }
  const res = await EMSApi.user.getUsers(query);
  console.log("ccccc", res);
  
  return res.data.data.employees as UserDetails[];
});

const homeSlice = createSlice({
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
      state.workspaceAdmins.isLoading = true;
    });
    builder.addCase(getWorkspaceAdmins.fulfilled, (state, action) => {
      state.workspaceAdmins.isLoading = false;
      state.workspaceAdmins.data = action.payload;
    });
    builder.addCase(getWorkspaceAdmins.rejected, (state,action) => {
      state.workspaceAdmins.isLoading = false;
      state.workspaceAdmins.error = action.payload as any;
    });
  }
});

export const workspaceState = (state: RootState) => _get(state, "workspaceReducer");

export default homeSlice.reducer;
