import apiClient from './api-client';
import { uploadPhoto } from './FileService';
import { CredentialResponse } from '@react-oauth/google';

export interface AuthResponse {
  _id: string,
  accessToken: string;
  refreshToken: string;
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', { username, password });
  return response.data;
};

export const register = async (email: string, username: string, password: string, profilePhoto: File | null): Promise<void> => {
  const imageUrl = await uploadPhoto(profilePhoto);
  await apiClient.post('/auth/register', { email, username, password, imageUrl});
};

export const logout = async (refreshToken: string): Promise<void> => {
  await apiClient.post('/auth/logout', { refreshToken });
};


export const googleSignIn = async (credentialResponse: CredentialResponse): Promise<AuthResponse> => {
  const repsonse = await apiClient.post<AuthResponse>(
    '/auth/google',
    credentialResponse
  );
  return repsonse.data;
}
