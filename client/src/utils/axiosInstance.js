import axios from "axios";

const PRODUCTION_SERVER_URI =
  "https://e-commerce-fullstack-marto-1.onrender.com/api/v1";

const DEVELOPMENT_SERVER_URI = "http://localhost:7000/api/v1";

const axiosInstance = axios.create({
  baseURL: PRODUCTION_SERVER_URI,
  withCredentials: true, // Include credentials for CORS requests
});

export default axiosInstance;
