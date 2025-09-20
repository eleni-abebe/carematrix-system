import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import * as api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Check if user is logged in on initial load
  const { data: userData, isLoading } = useQuery(
    'userProfile',
    () => api.auth.getProfile().then(res => res.data),
    {
      retry: false,
      onError: () => {
        setUser(null);
        localStorage.removeItem('token');
      },
    }
  );

  useEffect(() => {
    if (!isLoading) {
      setUser(userData || null);
      setLoading(false);
    }
  }, [userData, isLoading]);

  const login = async (credentials) => {
    try {
      const { data } = await api.auth.login(credentials);
      localStorage.setItem('token', data.token);
      queryClient.invalidateQueries('userProfile');
      return data;
    } catch (error) {
      throw error.response?.data || new Error('Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.auth.register(userData);
      return data;
    } catch (error) {
      throw error.response?.data || new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    queryClient.clear();
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
