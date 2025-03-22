import apiClient from './api-client';

export interface Post {
  title: string;
  content: string;
}

export interface LikeResponse {
  // Define the structure of the like response here
}

export const fetchPosts = async (accessToken: string): Promise<Post[]> => {
  const response = await apiClient.get<Post[]>('/posts', {
    headers: {
      'authorization': `${accessToken}`,
    },
  });
  return response.data;
};

export const createPost = async (accessToken: string, data: Post): Promise<void> => {
  await apiClient.post('/posts', data, {
    headers: {
      'authorization': `${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
};

export const updatePost = async (accessToken: string, postId: string, data: Post): Promise<void> => {
  await apiClient.put(`/posts/${postId}`, data, {
    headers: {
      'authorization': `${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
};

export const deletePost = async (accessToken: string, postId: string): Promise<void> => {
  await apiClient.delete(`/posts/${postId}`, {
    headers: {
      'authorization': `${accessToken}`,
    },
  });
};

export const likePost = async (accessToken: string, postId: string): Promise<LikeResponse> => {
  const response = await apiClient.post<LikeResponse>('/likes', { 'postId': postId }, {
    headers: {
      'authorization': `${accessToken}`,
    },
  });
  return response.data;
};

export const unlikePost = async (accessToken: string, postId: string): Promise<void> => {
  await apiClient.delete(`/likes/${postId}`, {
    headers: {
      'authorization': `${accessToken}`,
    },
  });
};

export const commentOnPost = async (accessToken: string, postId: string, comment: string): Promise<void> => {
  await apiClient.post(`/comments`, { 
    'postId': postId,
    'content': comment }, {
    headers: {
      'authorization': `${accessToken}`,
    },
  })
};