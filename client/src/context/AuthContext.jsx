import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('roshani_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (error) {
          console.error('Failed to load user token:', error);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = (tokenData, userData) => {
    localStorage.setItem('roshani_token', tokenData);
    setToken(tokenData);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('roshani_token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUserProfile, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};
