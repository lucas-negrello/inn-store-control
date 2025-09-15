import axios, {type AxiosResponse} from 'axios';
import type {IApiError} from "@/api/interfaces/ApiResponse.interface.ts";
import {Env} from "@/config/env.ts";

const axiosInstance = axios.create({
    baseURL: Env.apiBaseUrl,
    timeout: 10000, // 10 seconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

axiosInstance.interceptors.request.use(config => {
   const token = localStorage.getItem('token');
   if (token) {
       config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
});

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: IApiError): Promise<IApiError> => {
        console.error("Axios error:", error);
        return Promise.reject(error);
    }
);

export default axiosInstance;