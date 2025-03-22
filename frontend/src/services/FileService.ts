
import apiClient from './api-client';



export const uploadPhoto = async (photo: File | null) => {
  return new Promise<string>((resolve, reject) => {
    if (!photo) {
      resolve('');
      return;
    }
    const formData = new FormData();
    formData.append('file', photo);
    apiClient.post<any>('files/', formData, {
      headers: {
        'Content-Type': 'image/jpeg',
      },
    })
      .then((response) => {
        resolve(response.data.url);
      })
      .catch((error) => {
        reject(error);
      });
  })
}