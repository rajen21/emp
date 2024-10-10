import axios, {  AxiosRequestConfig, AxiosResponse } from "axios";

import { UserFormData } from "../containers/auth/register/RegisterUser";
import { LoginCredentials } from "./ApiTypes";

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

export const apiDomain = 'http://localhost:8000/api/v1';
export {axiosInstance};

const loginURL = `${apiDomain}/auth/login`;
const logOut = `${apiDomain}/auth/logout`;
const registerUser = `${apiDomain}/emp/register-user`;
const getUser = `${apiDomain}/emp/get-user-details`;
const workspace = `${apiDomain}/workspace/get-workspace`;
const users = `${apiDomain}/emp/get-users`;

const EMSApi = {
  auth: {
    login: (cred: LoginCredentials) => axiosInstance.post(loginURL,cred).then(res => res),
    logOut: () => axiosInstance.get(logOut). then(res=> res),
  },
  registerUser: {
    create: (data: UserFormData) => axiosInstance.post(registerUser, data).then(res => res),
  },
  user: {
    getUserDetails: () => axiosInstance.get(getUser).then(res=> res),
    getUsers: (config: any) => axiosInstance.get(users, config).then(res=> res),
  },
  workspace: {
    get: () => axiosInstance.get(workspace).then(res => res),
  },
};

export default EMSApi;