import axios from "axios";

const Backend_url = import.meta.env.VITE_BACKEND_URL;  

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
  withCredentials: false,
});

export default axiosInstance;
