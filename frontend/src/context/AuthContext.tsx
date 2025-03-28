import React, { createContext, useState, useContext, ReactNode } from 'react';
import { 
  login as loginService, 
  register as registerService, 
  googleSignIn as googleSignInService,
} from '../services/AuthService';
import { CredentialResponse } from '@react-oauth/google';

interface AuthContextType {
  _id: string | null
  accessToken: string | null;
  refreshToken: string | null;
  googleLogin: (credential: CredentialResponse) => Promise<void>;
  login: (email: string, username: string) => Promise<void>;
  register: (email: string, username: string, password: string, profilePhoto: File | null) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [_id, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));

  const login = async (email: string, username: string) => {
    const { _id, accessToken, refreshToken } = await loginService(email, username);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', _id);
  };

  const register = async (email: string, username: string, password: string, profilePhoto: File | null) => {
    await registerService(email, username, password, profilePhoto);
  };

  const googleLogin = async (credential: CredentialResponse) => {
    const { _id, accessToken, refreshToken } = await googleSignInService(credential);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserId(_id);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', _id);
  }

  const logout = async () => {
    // if (refreshToken) {
    //   await logoutService(refreshToken);
    // }
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('_id');
  };

  return (
    <AuthContext.Provider value={{ _id, accessToken, refreshToken, login, register, logout, googleLogin }}>
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