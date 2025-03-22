import apiClient from './api-client';

export interface Comment {
  _id?: string;
  postId?: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  user: {
    _id: string;
    username: string;
  };
}

export const commentOnPost = async (accessToken: string, data: Comment): Promise<void> => {
  await apiClient.post('/comments',
  {
    content: data.content,
    postId: data.postId,
  }
  ,
  {
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

export const deleteComment = async (accessToken: string, commentId: string): Promise<void> => {
  await apiClient.delete(`/comments/${commentId}`, {
    headers: {
      'authorization': `${accessToken}`,
    },
  });
};

export const updateComment = async (accessToken: string, commentId: string, contnet: String): Promise<void> => {
  await apiClient.put(`/comments/${commentId}`, { "content": contnet }, {
    headers: {
      'authorization': `${accessToken}`,
    },
  });
};