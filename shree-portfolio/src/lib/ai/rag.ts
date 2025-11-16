import { retrieveRelevantContent, extractCitations } from './retrieval';
import { buildMessages } from './prompts';
import { getOpenAIClient, isOpenAIConfigured } from './client';
import { AI_CONFIG } from './config';
import { Citation } from '@/data/types';
import { getAIResponse } from './rag-placeholder'; // Fallback

export interface ChatContext {
  enabled?: boolean;
  itemType?: 'project' | 'experience' | 'education';
  itemId?: string;
}

export interface RAGResponse {
  answer: string;
  citations: Citation[];
  confidence: number;
}

/**
 * Main RAG function that retrieves context and generates response
 * Falls back to placeholder if vector store is not available
 */
export async function getRAGResponse(
  query: string,
  context?: ChatContext
): Promise<RAGResponse> {
  // Check if vector store is available
  const { isVectorStoreAvailable } = await import('./vector-store');

  if (!isVectorStoreAvailable() || !isOpenAIConfigured()) {
    console.warn('Vector store or OpenAI client not available, using placeholder response');
    return getAIResponse(query, context);
  }

  try {
    // Retrieve relevant content
    const retrievedChunks = await retrieveRelevantContent(query, {
      limit: AI_CONFIG.retrieval.topK,
      filter: context?.enabled && context?.itemId
        ? {
            type: context.itemType,
            itemId: context.itemId,
          }
        : undefined,
      boostItemId: context?.enabled ? context.itemId : undefined,
    });

    // Log retrieval for debugging
    console.log(`[RAG] Query: "${query}"`);
    console.log(`[RAG] Retrieved ${retrievedChunks.length} chunks`);
    if (retrievedChunks.length > 0) {
      console.log(`[RAG] Top chunk similarity: ${retrievedChunks[0].similarity.toFixed(3)}`);
      console.log(`[RAG] Top chunk: ${retrievedChunks[0].metadata.title}`);
    } else {
      console.warn(`[RAG] No chunks retrieved for query: "${query}"`);
    }

    // Extract citations
    const citations = extractCitations(retrievedChunks);

    // Build messages for OpenAI
    const messages = buildMessages(query, retrievedChunks, context);
    
    // Log prompt for debugging (first 500 chars)
    console.log(`[RAG] User prompt preview: ${messages[1].content.substring(0, 500)}...`);

    // Generate response using OpenAI
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: messages as any,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
    });

    const answer = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

    // Calculate confidence based on retrieved chunks similarity scores
    const avgSimilarity = retrievedChunks.length > 0
      ? retrievedChunks.reduce((sum, chunk) => sum + chunk.similarity, 0) / retrievedChunks.length
      : 0.5;

    return {
      answer,
      citations,
      confidence: Math.min(avgSimilarity, 0.95), // Cap at 0.95
    };
  } catch (error) {
    console.error('RAG error:', error);
    // Fallback to placeholder
    return getAIResponse(query, context);
  }
}

/**
 * Streams RAG response using OpenAI streaming API
 */
export async function* streamRAGResponse(
  query: string,
  context?: ChatContext
): AsyncGenerator<string, void, unknown> {
  // Check if vector store is available
  const { isVectorStoreAvailable } = await import('./vector-store');
  
  if (!isVectorStoreAvailable() || !isOpenAIConfigured()) {
    console.warn('Vector store or OpenAI client not available, using placeholder response');
    const response = await getAIResponse(query, context);
    // Stream the response word by word as fallback
    const words = response.answer.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    return;
  }

  try {
    // Retrieve relevant content
    let retrievedChunks = await retrieveRelevantContent(query, {
      limit: AI_CONFIG.retrieval.topK,
      filter: context?.enabled && context?.itemId
        ? {
            type: context.itemType,
            itemId: context.itemId,
          }
        : undefined,
      boostItemId: context?.enabled ? context.itemId : undefined,
    });

    // Log retrieval for debugging
    console.log(`[RAG Stream] Query: "${query}"`);
    console.log(`[RAG Stream] Retrieved ${retrievedChunks.length} chunks`);
    if (retrievedChunks.length > 0) {
      console.log(`[RAG Stream] Top chunk similarity: ${retrievedChunks[0].similarity.toFixed(3)}`);
      console.log(`[RAG Stream] Top chunk: ${retrievedChunks[0].metadata.title}`);
    } else {
      console.warn(`[RAG Stream] No chunks retrieved for query: "${query}"`);
      // Try with even lower threshold as fallback
      const fallbackChunks = await retrieveRelevantContent(query, {
        limit: 5,
        minScore: 0.4, // Very low threshold
      });
      if (fallbackChunks.length > 0) {
        console.log(`[RAG Stream] Found ${fallbackChunks.length} chunks with lower threshold`);
        retrievedChunks = fallbackChunks;
      }
    }

    // Build messages for OpenAI
    const messages = buildMessages(query, retrievedChunks, context);

    // Stream response using OpenAI
    const openai = getOpenAIClient();
    const stream = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: messages as any,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error('RAG streaming error:', error);
    // Fallback to placeholder
    const response = await getAIResponse(query, context);
    const words = response.answer.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  }
}

