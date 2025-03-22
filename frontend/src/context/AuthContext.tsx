import React, { createContext, useState, useContext, ReactNode } from 'react';
import { login as loginService, register as registerService, logout as logoutService, AuthResponse } from '../services/AuthService';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, username: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));

  const login = async (email: string, username: string) => {
    const { accessToken, refreshToken } = await loginService(email, username);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const register = async (email: string, username: string, password: string) => {
    await registerService(email, username, password);
  };

  const logout = async () => {
    // if (refreshToken) {
    //   await logoutService(refreshToken);
    // }
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};