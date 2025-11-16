import { getOpenAIClient, isOpenAIConfigured } from './client';
import { ContentChunk } from './chunking';
import { getCachedEmbedding, setCachedEmbedding } from './cache';

const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 1536;
const BATCH_SIZE = 100; // OpenAI allows up to 2048 inputs per request

/**
 * Generates embeddings for a single text (with caching)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI is not configured. Set OPENAI_API_KEY to generate embeddings.');
  }

  const openai = getOpenAIClient();
  // Check cache first
  const cached = getCachedEmbedding(text);
  if (cached) {
    return cached;
  }

  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
      dimensions: EMBEDDING_DIMENSIONS,
    });

    const embedding = response.data[0].embedding;
    
    // Cache the embedding
    setCachedEmbedding(text, embedding);

    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generates embeddings for multiple texts in batches
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI is not configured. Set OPENAI_API_KEY to generate embeddings.');
  }

  const openai = getOpenAIClient();
  const embeddings: number[][] = [];
  
  // Process in batches
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    
    try {
      const response = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: batch,
        dimensions: EMBEDDING_DIMENSIONS,
      });

      // Add embeddings in order
      response.data.forEach((item) => {
        embeddings.push(item.embedding);
      });

      // Add small delay to avoid rate limits
      if (i + BATCH_SIZE < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`Error generating embeddings for batch ${i}-${i + BATCH_SIZE}:`, error);
      throw new Error(`Failed to generate embeddings batch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return embeddings;
}

/**
 * Generates embeddings for content chunks
 */
export async function generateChunkEmbeddings(chunks: ContentChunk[]): Promise<Array<ContentChunk & { embedding: number[] }>> {
  const texts = chunks.map(chunk => chunk.content);
  const embeddings = await generateEmbeddingsBatch(texts);

  return chunks.map((chunk, index) => ({
    ...chunk,
    embedding: embeddings[index],
  }));
}

/**
 * Retry wrapper for embedding generation with exponential backoff
 */
export async function generateEmbeddingWithRetry(
  text: string,
  maxRetries = 3,
  initialDelay = 1000
): Promise<number[]> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await generateEmbedding(text);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.warn(`Embedding generation failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Failed to generate embedding after retries');
}

