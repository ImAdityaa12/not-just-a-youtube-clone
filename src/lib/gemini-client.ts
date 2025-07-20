import { GoogleGenAI } from '@google/genai';

export const geminiClient = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
});
