import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// a request interceptor
axiosClient.interceptors.request.use((config) => {
  // Get the token from local storage
  const token = localStorage.getItem('ACCESS_TOKEN');

  // If a token exists, add it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  //for request error
  return Promise.reject(error);
});


export default axiosClient;