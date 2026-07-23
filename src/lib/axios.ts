import axios from "axios";
import store from "../store";
import { setAccessToken } from "../store/slices/authSlice";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
})

axiosInstance.interceptors.request.use((config) => {

    const token = store.getState().auth.accessToken;

    if(token){

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {

        const originalRequest=error.config;

        if(
            error.response?.status===401 &&
            !originalRequest._retry
        ){

            originalRequest._retry=true;

            const response=await axios.post(
                "/auth/refresh",
                {},
                {
                    withCredentials:true
                }
            );

            store.dispatch(
                setAccessToken(response.data?.accessToken)
            );

            originalRequest.headers.Authorization=
                `Bearer ${response.data?.accessToken}`;

            return axiosInstance(originalRequest);

        }

        return Promise.reject(error);
    }
);


export default axiosInstance;