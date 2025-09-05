import { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient'; // Make sure this path is correct

// 1. Create the context. This is kept internal to this file and not exported.
const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  register: () => {},
  logout: () => {},
});

// 2. Create the AuthProvider. This component will wrap your application or parts of it.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

  // Effect to fetch user data if a token exists on page load
  useEffect(() => {
    if (token) {
      axiosClient.get('/user')
        .then(({ data }) => {
          setUser(data);
        })
        .catch(() => {
          // If token is invalid, remove it
          localStorage.removeItem('ACCESS_TOKEN');
          setToken(null);
        });
    }
  }, [token]); // Rerun effect if token changes

  // Helper function to manage the token in state and localStorage
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
  };

  // Provide the context value to all children components
  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create and export the custom useAuth hook.
// THIS IS THE ONLY THING COMPONENTS SHOULD IMPORT FROM THIS FILE.
export const useAuth = () => {
  return useContext(AuthContext);
};