import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { decodeJWT } from '../utils/jwt';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

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
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Login failed');
    saveAuth(data);
  };

  const register = async (name, email, password) => {
    console.log('Frontend register attempt:', { name, email, passwordLength: password?.length });
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    console.log('Register response:', { status: res.status, data });
    if (!res.ok) throw new Error(data?.message || data?.errors?.[0]?.msg || 'Register failed');
    return data;
  };

  const logout = () => {
    saveAuth({ token: null, user: null });
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
    const res = await fetch(`${API_BASE}/auth/password/forgot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  };

  const resetPassword = async (tokenParam, password) => {
    const res = await fetch(`${API_BASE}/auth/password/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenParam, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Reset failed');
    return data;
  };


  const value = useMemo(
    () => ({ token, user, loading, login, register, logout, oauthLogin, requestPasswordReset, resetPassword }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


