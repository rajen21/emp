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
  address:string;
  company_address?: string;
  workSpaceAdminId?: string;
  superAdminId?: string;
  password?: string;
}


const initialState = {
  employeeList: {
    data: null,
    isLoading: false,
    error: ""
  },
  workspaceAdmins: {
    data: null,
    isLoading: false,
    error: ""
  },
  userData: {
    data:null,
    isLoading: false,
    error: "",
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

export const getWorkSpaceAdminList = createAsyncThunk("employee/getWorkSpaceAdminList", async () => {
  const query = {
    params: {
      role: "workspace_admin"
    }
  }
  const res = await EMSApi.user.getUsers(query);
  return _get(res, "data.data");
});

export const fetUserData = createAsyncThunk("employee/fetUserData", async (id: string) => {
  const query = {
    params: {
      // role: "workspace_admin"
      _id: id
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
      state.employeeList.error = action.payload as string;
    });
    builder.addCase(getWorkSpaceAdminList.pending, (state) => {
      state.workspaceAdmins.isLoading = true;
    });
    builder.addCase(getWorkSpaceAdminList.fulfilled, (state, action) => {
      state.workspaceAdmins.isLoading = false;
      state.workspaceAdmins.data = action.payload;
    });
    builder.addCase(getWorkSpaceAdminList.rejected, (state, action) => {
      state.workspaceAdmins.isLoading = false;
      state.workspaceAdmins.error = action.payload as string;
    });
    builder.addCase(fetUserData.pending, (state) => {
      state.userData.isLoading = true;
    });
    builder.addCase(fetUserData.fulfilled, (state, action) => {
      state.userData.isLoading = false;
      state.userData.data = action.payload;
    });
    builder.addCase(fetUserData.rejected, (state, action) => {
      state.userData.isLoading = false;
      state.userData.error = action.payload as string;
    })
  }
});

export const employeeState = (state: RootState) => _get(state, "employeeReducer");

export default employeeSlice.reducer;
