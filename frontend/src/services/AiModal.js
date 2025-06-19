import { GoogleGenAI } from "@google/genai";

export async function GetData(prompt) {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GOOGLE_GENAI_API_KEY,
  });

  const chat = await ai.chats.create({
    model: "gemini-2.0-flash",
    config: {
      responseMimeType: "application/json",
    },
  });

  const response = await chat.sendMessage({
    message: prompt,
  });

  const text = await response.text;

  return text;
}
