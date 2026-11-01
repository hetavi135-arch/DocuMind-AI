import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Ensure User-Agent header is set to 'aistudio-build' as required by Gemini API guidelines
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export const GEMINI_MODEL = 'gemini-3.8-flash';
export const EMBEDDING_MODEL = 'gemini-embedding-2-preview';

/**
 * Generate embedding for text with timeout protection
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  try {
    const embedPromise = ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: text.slice(0, 1500),
    });

    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500));

    const result: any = await Promise.race([embedPromise, timeoutPromise]);
    if (!result) return null;

    const firstEmbedding = result.embeddings?.[0];
    const embeddingValues = firstEmbedding?.values;
    if (embeddingValues && Array.isArray(embeddingValues)) {
      return embeddingValues;
    }
    return null;
  } catch (error) {
    console.warn('Embedding generation warning (falling back to lexical):', error);
    return null;
  }
}

/**
 * Cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Lexical similarity scoring for hybrid search / fallback
 */
export function lexicalScore(query: string, chunkText: string): number {
  const queryWords = query
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2);
  if (queryWords.length === 0) return 0;
  const chunkLower = chunkText.toLowerCase();

  let matches = 0;
  for (const word of queryWords) {
    if (chunkLower.includes(word)) {
      matches++;
    }
  }
  return matches / queryWords.length;
}

/**
 * Resilient generateContent that cascades models on quota/timeout
 */
export async function generateContentWithFallback(params: {
  contents: any;
  systemInstruction?: string;
  responseSchema?: any;
  responseMimeType?: string;
}): Promise<string> {
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const config: any = {};
      if (params.systemInstruction) {
        config.systemInstruction = params.systemInstruction;
      }
      if (params.responseMimeType) {
        config.responseMimeType = params.responseMimeType;
      }
      if (params.responseSchema) {
        config.responseSchema = params.responseSchema;
      }

      const genPromise = ai.models.generateContent({
        model,
        contents: params.contents,
        config,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout on ${model}`)), 6500)
      );

      const response: any = await Promise.race([genPromise, timeoutPromise]);

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const isQuota =
        err?.status === 'RESOURCE_EXHAUSTED' ||
        err?.message?.includes('429') ||
        err?.message?.includes('Quota exceeded');
      if (isQuota) {
        console.warn(`Model ${model} quota exhausted, attempting cascade fallback...`);
        continue;
      }
      console.warn(`Model ${model} failed:`, err?.message || err);
    }
  }

  throw lastError || new Error('All model generation attempts failed.');
}
