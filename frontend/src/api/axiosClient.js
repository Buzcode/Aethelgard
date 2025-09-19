// src/api/axiosClient.js

import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api' 
});

// This interceptor is the ONLY thing needed to add the auth token.
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      // This is the line that was not running correctly before.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// This response interceptor is great for handling expired tokens. Keep it.
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ACCESS_TOKEN');
      // You might want to redirect the user to the login page here.
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;