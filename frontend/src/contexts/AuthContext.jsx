import { createContext, useState } from 'react';
import axiosClient from '../api/axiosClient';

// 1. Create the context
const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
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

  const logout = () => {
    // We will implement the API call for logout later
    setUser(null);
    _setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
;  