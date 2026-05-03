import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const getToken = () => window.localStorage.getItem('token');
const getStoredUser = () => {
  const stored = window.localStorage.getItem('user');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getStoredUser());

  const login = (newToken, newUser) => {
    window.localStorage.setItem('token', newToken);
    window.localStorage.setItem('user', JSON.stringify(newUser));
    window.localStorage.setItem('role', newUser.role);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('role');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);
  const getUser = () => user;
  const getRole = () => user?.role;
  const isAdmin = () => user?.role === 'ADMIN';

  const value = useMemo(
    () => ({ token, user, login, logout, isAuthenticated, getUser, getRole, isAdmin }),
    [token, user]
  );

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
