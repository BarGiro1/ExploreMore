import apiClient from './api-client';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', { username, password });
  return response.data;
};

export const register = async (email: string, username: string, password: string): Promise<void> => {
  await apiClient.post('/auth/register', { email, username, password });
};

export const logout = async (refreshToken: string): Promise<void> => {
  await apiClient.post('/auth/logout', { refreshToken });
};