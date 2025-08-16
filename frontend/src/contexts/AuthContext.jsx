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
  
  const login = async (email, password) => {
    const response = await axiosClient.post('/login', { email, password });
    setUser(response.data.user);
    _setToken(response.data.access_token);
    return response;
  };

  // --- NEW REGISTER FUNCTION ---
  const register = async (name, email, password) => {
    // 1. Call the backend register endpoint
    await axiosClient.post('/register', { name, email, password });
    
    // 2. After successful registration, immediately log the user in
    //    to get their data and a token.
    await login(email, password);
  };

  const logout = () => {
    // We will implement the API call for logout later
    setUser(null);
    _setToken(null);
  };

  // --- PROVIDE THE NEW REGISTER FUNCTION IN THE VALUE ---
  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};