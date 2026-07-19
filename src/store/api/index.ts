import axios from 'axios';
import store from '../index';
import { setAccessToken } from '../slices/authSlice';




const API = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
})

API.interceptors.request.use(config => {
    const accessToken = store.getState().auth.accessToken;
    if(accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
})

API.interceptors.response.use(
    (response) => response,

    async (error) => {

        if (error.response?.status === 401) {

            const res = await API.post("/auth/refresh");

            store.dispatch(setAccessToken(res.data?.accessToken))

            error.config.headers.Authorization =
                `Bearer ${res.data.accessToken}`;

            return API(error.config);
        }

        return Promise.reject(error);
    }
);

export {  API };