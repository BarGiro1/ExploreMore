import apiClient from './api-client';

export interface Comment {
  postId: string;
  content: string;
}

export const commentOnPost = async (accessToken: string, data: Comment): Promise<void> => {
  await apiClient.post('/comments', data, {
    headers: {
      'authorization': `${accessToken}`,
    },
  });
};

export const fetchComments = async (accessToken: string, postId: string): Promise<Comment[]> => {
  const response = await apiClient.get<Comment[]>(`/comments?postId=${postId}`, {
    headers: {
      'authorization': `${accessToken}`,
    },
  });
  return response.data;
};