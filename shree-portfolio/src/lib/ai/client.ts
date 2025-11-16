import OpenAI from 'openai';

let cachedClient: OpenAI | null = null;

export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function getOpenAIClient(): OpenAI {
  if (!isOpenAIConfigured()) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  return cachedClient;
}

