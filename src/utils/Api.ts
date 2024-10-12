import axios, {  AxiosRequestConfig, AxiosResponse } from "axios";

import { UserFormData } from "../containers/employee/CreateEmployee";
import { CustomConfig, LoginCredentials } from "./ApiTypes";

const axiosInstance = axios.create({
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const authToken = localStorage.getItem("emp-token");
    
    config.headers = {
      authorization: authToken
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    
    localStorage.setItem("emp-token", JSON.stringify({authToken: response.headers["authorization"]}));
    return response;
  },
  (error) => {
    // Handle errors
    console.error('Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiDomain = import.meta.env.VITE_APP_URL;

export {axiosInstance};

const loginURL = `${apiDomain}/auth/login`;
const logOut = `${apiDomain}/auth/logout`;
const registerUser = `${apiDomain}/emp/register-user`;
const getUser = `${apiDomain}/emp/get-user-details`;
const workspace = `${apiDomain}/workspace/get-workspace`;
const users = `${apiDomain}/emp`;

const EMSApi = {
  auth: {
    login: (cred: LoginCredentials) => axiosInstance.post(loginURL,cred).then(res => res),
    logOut: () => axiosInstance.get(logOut). then(res=> res),
  },
  registerUser: {
    create: (data: FormData | UserFormData) => axiosInstance.post(registerUser, data).then(res => res),
  },
  user: {
    getUserDetails: () => axiosInstance.get(getUser).then(res=> res),
    getUsers: (config: CustomConfig) => axiosInstance.get(`${users}/get-users`, config).then(res=> res),
    updateUser: (data:any, config:CustomConfig) => axiosInstance.patch(`${users}/update-employee`,data,config),
  },
  workspace: {
    get: (config: CustomConfig) => axiosInstance.get(workspace, config).then(res => res),
  },
};

export default EMSApi;