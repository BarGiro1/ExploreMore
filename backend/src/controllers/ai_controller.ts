import { Request, Response } from 'express';
import axios from 'axios';

export const generateFromAI = async (req: Request, res: Response) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { 'Content-Type': 'application/json' },
        params: {
          key: process.env.GEMINI_API_KEY,
        },
      }
    );

    const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ text: generatedText });
  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).json({ error: 'Failed to fetch from AI' });
  }
};
