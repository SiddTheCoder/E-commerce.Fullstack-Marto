import axios from 'axios';

const PRODUCTION_SERVER_URI =
  "https://e-commerce-fullstack-kinnam-rest.onrender.com/api/v1";

const DEVELOPMENT_SERVER_URI = "http://localhost:5000/api/v1";  

const axiosInstance = axios.create({
  baseURL: PRODUCTION_SERVER_URI,
  withCredentials: true,  // for cookies
});

export default axiosInstance;
