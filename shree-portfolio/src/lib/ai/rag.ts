import { retrieveRelevantContent, extractCitations, RetrievedChunk } from './retrieval';
import { buildMessages } from './prompts';
import { getOpenAIClient, isOpenAIConfigured } from './client';
import { AI_CONFIG } from './config';
import { Citation } from '@/data/types';
import { getAIResponse } from './rag-placeholder'; // Fallback
import { projects } from '@/data/portfolio';
import { chunkProject } from './chunking';

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

function isProjectOverviewQuery(query: string): boolean {
  const normalized = query.toLowerCase();
  return (
    /\bprojects?\b/.test(normalized) &&
    (
      /\btop\b/.test(normalized) ||
      /\bbest\b/.test(normalized) ||
      /\bfeatured\b/.test(normalized) ||
      /\bfavorite\b/.test(normalized) ||
      /\bhighlight(s)?\b/.test(normalized) ||
      /\bportfolio\b/.test(normalized) ||
      /\bwhat are\b/.test(normalized)
    )
  );
}

function getProjectCategoryMatcher(query: string): ((category: string) => boolean) | null {
  const normalized = query.toLowerCase();

  if (normalized.includes('ai/ml') || normalized.includes('machine learning') || /\bai\b/.test(normalized) || /\bml\b/.test(normalized)) {
    return (category) => category === 'AI/ML';
  }
  if (normalized.includes('full-stack') || normalized.includes('full stack')) {
    return (category) => category === 'Full-Stack';
  }
  if (normalized.includes('open source')) {
    return (category) => category === 'Open Source';
  }
  if (normalized.includes('academic')) {
    return (category) => category === 'Academic';
  }
  if (normalized.includes('data')) {
    return (category) => category === 'Data Engineering';
  }

  return null;
}

function buildDeterministicProjectOverviewChunks(query: string): RetrievedChunk[] {
  const categoryMatcher = getProjectCategoryMatcher(query);
  const matchingProjects = categoryMatcher
    ? projects.filter((project) => categoryMatcher(project.category))
    : projects;

  const rankedProjects = [...matchingProjects].sort((a, b) => {
    if (a.featured !== b.featured) {
      return Number(b.featured) - Number(a.featured);
    }
    if (a.year !== b.year) {
      return b.year - a.year;
    }
    return a.sortOrder - b.sortOrder;
  });

  return rankedProjects.slice(0, 3).flatMap((project, projectIndex) => {
    const projectChunks = chunkProject(project);
    const selectedChunks = [projectChunks[0], projectChunks[2] || projectChunks[1]].filter(Boolean);

    return selectedChunks.map((chunk, chunkIndex) => ({
      ...chunk,
      similarity: Math.max(0.95 - projectIndex * 0.05 - chunkIndex * 0.01, 0.8),
    }));
  });
}

function countUniqueProjects(chunks: RetrievedChunk[]): number {
  return new Set(
    chunks
      .filter((chunk) => chunk.metadata.type === 'project')
      .map((chunk) => chunk.metadata.itemId)
  ).size;
}

export async function resolveRetrievedChunks(
  query: string,
  context?: ChatContext
): Promise<RetrievedChunk[]> {
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

  if (context?.enabled && context?.itemId) {
    return retrievedChunks;
  }

  if (isProjectOverviewQuery(query)) {
    const deterministicProjectChunks = buildDeterministicProjectOverviewChunks(query);
    const projectOnlyChunks = retrievedChunks.filter((chunk) => chunk.metadata.type === 'project');
    const shouldUseDeterministicFallback =
      retrievedChunks.length === 0 ||
      projectOnlyChunks.length === 0 ||
      countUniqueProjects(projectOnlyChunks) < 3;

    if (shouldUseDeterministicFallback) {
      return deterministicProjectChunks;
    }

    return projectOnlyChunks;
  }

  return retrievedChunks;
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
    const retrievedChunks = await resolveRetrievedChunks(query, context);

    // Log retrieval for debugging

    if (retrievedChunks.length > 0) {

    } else {
      console.warn(`[RAG] No chunks retrieved for query: "${query}"`);
    }

    // Extract citations
    const citations = extractCitations(retrievedChunks);

    // Build messages for OpenAI
    const messages = buildMessages(query, retrievedChunks, context);

    // Log prompt for debugging (first 500 chars)

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
    let retrievedChunks = await resolveRetrievedChunks(query, context);

    // Log retrieval for debugging
    if (retrievedChunks.length > 0) {

    } else {
      console.warn(`[RAG Stream] No chunks retrieved for query: "${query}"`);
      // Try with even lower threshold as fallback
      const fallbackChunks = await retrieveRelevantContent(query, {
        limit: 5,
        minScore: 0.4, // Very low threshold
      });
      if (fallbackChunks.length > 0) {

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
