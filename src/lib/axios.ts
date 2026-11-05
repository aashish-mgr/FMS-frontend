import axios from "axios";
import { API_BASE_URL } from "./apiConfig";


const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
})




export default axiosInstance;