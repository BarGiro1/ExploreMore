import apiClient from './api-client';

interface AIResponse {
  text: string;
}

export const solveRiddle = async (text: string): Promise<string> => {
  const prompt = `אתה מומחה בפתרון חידות. פתר לי את החידה הבאה: "${text}"`;

  const response = await apiClient.post<AIResponse>('/ai/generate', { prompt });

  return response.data.text;
};
