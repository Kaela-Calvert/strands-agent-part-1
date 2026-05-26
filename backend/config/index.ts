export const config = {
  port: Number(process.env.PORT) || 3001,
  geminiApiKey: process.env.GEMINI_API_KEY,
  model: {
    id: 'gemini-2.5-flash',
    temperature: 0.7,
    maxOutputTokens: 65536,
    topP: 0.9,
    topK: 40,
  },
} as const
