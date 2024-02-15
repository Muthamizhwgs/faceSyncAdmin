import axios from "axios";

const apiInstance = axios.create({
  baseURL: "http://localhost:3000/v1/",
  // baseURL: "https://facesyncapi.whydev.co.in/v1/",

});

// Request interceptor
apiInstance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("facesynctoken");
    config.headers.Authorization = `Bearer ${authToken}`;
    return config;
  },
  (error) => {
    console.error("Request Error Interceptor:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiInstance;
