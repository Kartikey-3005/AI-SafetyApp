import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('safekids_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('safekids_auth_token') || null;
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const saveAuthSession = (userData, tokenString) => {
    setUser(userData);
    setToken(tokenString);
    localStorage.setItem('safekids_auth_user', JSON.stringify(userData));
    localStorage.setItem('safekids_auth_token', tokenString);
  };

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      saveAuthSession(data.user, data.token);
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (name, email, password, role = 'PARENT') => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      saveAuthSession(data.user, data.token);
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googlePayload = {}) => {
    setLoading(true);
    setAuthError(null);
    try {
      const payload = {
        email: googlePayload.email || 'guardian.google@safekids.ai',
        name: googlePayload.name || 'Google Guardian User',
        googleId: googlePayload.googleId || `google_${Date.now()}`,
        avatarUrl: googlePayload.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=GoogleUser',
        role: googlePayload.role || 'PARENT',
      };

      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Google authentication failed.');
      }

      saveAuthSession(data.user, data.token);
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('safekids_auth_user');
    localStorage.removeItem('safekids_auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        setAuthError,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
