// src/contexts/AuthContext.jsx

import { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => {},
});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
  const [loading, setLoading] = useState(true); // Start as true

  useEffect(() => {
    // This effect runs once on app load to verify the stored token.
    const tokenFromStorage = localStorage.getItem('ACCESS_TOKEN');
    if (tokenFromStorage) {
      axiosClient.get('/user')
        .then(({ data }) => {
          setUser(data);
        })
        .catch(() => {
          // If the token is invalid, remove it.
          localStorage.removeItem('ACCESS_TOKEN');
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // If there's no token, we are done loading.
      setLoading(false);
    }
  }, []); // Note: The dependency array is empty to ensure it runs only once on mount.

  const _setToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('ACCESS_TOKEN', newToken);
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
    }
  };

  const login = async (email, password) => {
    const response = await axiosClient.post('/login', { email, password });
    setUser(response.data.user);
    _setToken(response.data.access_token);
    return response.data.user;
  };

  const register = async (userData) => {
    const response = await axiosClient.post('/register', userData);
    setUser(response.data.user);
    _setToken(response.data.access_token);
    return response.data.user;
  };

  const logout = () => {
    setUser(null);
    _setToken(null);
    // You might want to also call the backend logout endpoint if you have one.
    // axiosClient.post('/logout');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {/* This ensures the rest of your app doesn't render until we know
          if the user is logged in or not. This is critical. */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};