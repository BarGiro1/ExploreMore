import React, { createContext, useState, useContext, ReactNode } from 'react';
import { 
  login as loginService, 
  register as registerService, 
  googleSignIn as googleSignInService,
} from '../services/AuthService';
import { CredentialResponse } from '@react-oauth/google';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  googleLogin: (credential: CredentialResponse) => Promise<void>;
  login: (email: string, username: string) => Promise<void>;
  register: (email: string, username: string, password: string, profilePhoto: File | null) => Promise<void>;
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

  const register = async (email: string, username: string, password: string, profilePhoto: File | null) => {
    await registerService(email, username, password, profilePhoto);
  };

  const googleLogin = async (credential: CredentialResponse) => {
    const { accessToken, refreshToken } = await googleSignInService(credential);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

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
    <AuthContext.Provider value={{ accessToken, refreshToken, login, register, logout, googleLogin }}>
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