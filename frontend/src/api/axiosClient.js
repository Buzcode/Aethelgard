import axios from 'axios';

// Create an Axios instance with a pre-configured base URL
const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

export default axiosClient; 