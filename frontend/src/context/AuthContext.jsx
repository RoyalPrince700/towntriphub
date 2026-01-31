import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { decodeJWT } from '../utils/jwt';
import api from '../services/api';

const AuthContext = createContext(null);

function getStoredAuth() {
  try {
    const raw = localStorage.getItem('tth_auth');
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

function setStoredAuth(value) {
  localStorage.setItem('tth_auth', JSON.stringify(value));
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredAuth();
    setToken(stored.token);
    setUser(stored.user);
    setLoading(false);
  }, []);

  const saveAuth = (next) => {
    setToken(next?.token || null);
    setUser(next?.user || null);
    setStoredAuth({ token: next?.token || null, user: next?.user || null });
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      saveAuth(res.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Register failed');
    }
  };

  const logout = () => {
    saveAuth({ token: null, user: null });
    window.location.href = '/login';
  };

  const refreshUser = async () => {
    if (!token) return false;
    try {
      const res = await api.get('/auth/profile');
      const data = res.data;
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      setStoredAuth({ token, user: updatedUser });
      return true;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      if (error.response?.status === 401) {
        logout();
      }
      return false;
    }
  };

  const oauthLogin = (token) => {
    try {
      const decoded = decodeJWT(token);
      if (decoded) {
        const user = {
          id: decoded.id,
          name: decoded.name || 'User',
          email: decoded.email,
          role: decoded.role || 'user',
          isEmailVerified: decoded.isEmailVerified || false,
          avatarUrl: decoded.avatarUrl
        };
        saveAuth({ token, user });
        return true;
      }
      return false;
    } catch (error) {
      console.error('OAuth login failed:', error);
      return false;
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const res = await api.post('/auth/password/forgot', { email });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to request password reset');
    }
  };

  const resetPassword = async (tokenParam, password) => {
    try {
      const res = await api.post('/auth/password/reset', { token: tokenParam, password });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Reset failed');
    }
  };


  const value = useMemo(
    () => ({ token, user, loading, login, register, logout, refreshUser, oauthLogin, requestPasswordReset, resetPassword }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


