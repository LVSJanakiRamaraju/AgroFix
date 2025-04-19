// src/context/authContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${URL}/api/auth/login`, { email, password });
      console.log("Login response:", response.data); // Debugging line
      const { token, isAdmin, name } = response.data;

      const userData = { email, isAdmin, name };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(token);
      setUser(userData);
    } catch (error) {
      console.error('Login failed', error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${URL}/api/auth/register`, { name, email, password });

      await login(email, password);
    } catch (error) {
      console.error('Registration failed', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
