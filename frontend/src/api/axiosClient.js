import axios from 'axios';

const axiosClient = axios.create({
  // --- THIS IS THE CORRECTED LINE ---
  baseURL: 'http://127.0.0.1:8000/api',

  // This is crucial for Laravel Sanctum to work with SPAs
  withCredentials: true,
});

// A request interceptor to automatically add the auth token
axiosClient.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('ACCESS_TOKEN'); // Ensure this key is correct

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// A response interceptor for handling common errors like 401 Unauthorized
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is a 401 Unauthorized response
    if (error.response && error.response.status === 401) {
      // The user's token is invalid or has expired.
      // Remove the bad token from storage.
      localStorage.removeItem('ACCESS_TOKEN');
      // Optionally redirect the user to the login page
      // window.location.href = '/login';
    }
    // Return the error so that components can handle it in their .catch() blocks
    return Promise.reject(error);
  }
);

export default axiosClient;