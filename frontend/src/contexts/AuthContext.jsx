import { createContext, useState } from 'react';
import axiosClient from '../api/axiosClient';

// 1. Create the context with a default shape
const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  register: () => {}, // Add register to the default shape
  logout: () => {},
});

export { AuthContext };

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

  // Function to set the token in state and local storage
  const _setToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('ACCESS_TOKEN', newToken);
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
    }
  };
  
  const login = async (credentials) => {
    // Assuming credentials is an object like { email, password }
    const response = await axiosClient.post('/login', credentials);
    setUser(response.data.user);
    _setToken(response.data.access_token);
    return response;
  }; 

  // --- THIS IS THE CORRECT, FINAL VERSION OF THE REGISTER FUNCTION ---
  const register = async (userData) => {
    // 1. Call the backend to create the user
    await axiosClient.post('/register', userData);
    
    // 2. After successful registration, immediately log them in
    //    to get their user data and set the token.
    await login({ email: userData.email, password: userData.password });
  };

  const logout = () => {
    setUser(null);
    _setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};