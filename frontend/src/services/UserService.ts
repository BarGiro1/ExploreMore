import apiClient from './api-client';

export interface UserProfile {
  email: string;
  username: string;
  imageUrl: string;
}

export const fetchUserProfile = async (accessToken: string): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/users/me', {
    headers: {
      'authorization': `${accessToken}`,
    },
  });
  return response.data;
};

export const updateUserProfile = async (accessToken: string, data: { email: string; username: string }): Promise<void> => {
  await apiClient.put('/users', data, {
    headers: {
      'authorization': `${accessToken}`,
    },
  });
};
