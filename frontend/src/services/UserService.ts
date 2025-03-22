import apiClient from './api-client';
import { uploadPhoto } from './FileService';

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

export const updateUserProfile = async (accessToken: string, data: { email: string; username: string }, photo: File | null): Promise<void> => {
  const imageUrl = await uploadPhoto(photo);
  const updatedData = { ...data, imageUrl };
  await apiClient.put('/users', updatedData, {
    headers: {
      'authorization': `${accessToken}`,
    },
  });
};
