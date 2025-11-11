import { generateEmbedding } from './embeddings';
import { searchSimilar } from './vector-store';
import { Citation } from '@/data/types';
import { AI_CONFIG } from './config';

export interface RetrievedChunk {
  content: string;
  metadata: {
    type: 'project' | 'experience' | 'education' | 'skill' | 'bio' | 'faq' | 'story' | 'philosophy' | 'interests' | 'workstyle';
    itemId: string;
    title: string;
    year?: number;
    category?: string;
    tags?: string[];
  };
  similarity: number;
}

/**
 * Retrieves relevant content chunks for a query using RAG
 */
export async function retrieveRelevantContent(
  query: string,
  options: {
    limit?: number;
    minScore?: number; // Allow override of minScore
    filter?: {
      type?: 'project' | 'experience' | 'education' | 'skill' | 'bio' | 'faq' | 'story' | 'philosophy' | 'interests' | 'workstyle';
      itemId?: string;
      category?: string;
    };
    boostItemId?: string; // Boost relevance for a specific item
  } = {}
): Promise<RetrievedChunk[]> {
  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // Search for similar content
  const results = await searchSimilar(queryEmbedding, {
    limit: options.limit || AI_CONFIG.retrieval.topK,
    minScore: options.minScore ?? AI_CONFIG.retrieval.minScore,
    filter: options.filter,
  });

  // Convert to RetrievedChunk format
  let chunks: RetrievedChunk[] = results.map((result) => ({
    content: result.content,
    metadata: result.metadata as RetrievedChunk['metadata'],
    similarity: result.similarity,
  }));

  // Boost specific item if requested
  if (options.boostItemId) {
    chunks = chunks.map((chunk) => {
      if (chunk.metadata.itemId === options.boostItemId) {
        return {
          ...chunk,
          similarity: Math.min(chunk.similarity + 0.1, 1.0), // Boost similarity
        };
      }
      return chunk;
    });

    // Re-sort by similarity
    chunks.sort((a, b) => b.similarity - a.similarity);
  }

  return chunks;
}

/**
 * Extracts citations from retrieved chunks
 * Only includes types that have detail views (clickable citations)
 */
export function extractCitations(chunks: RetrievedChunk[]): Citation[] {
  const citations: Citation[] = [];
  const seenIds = new Set<string>();

  // Only include types that have detail panel views
  const clickableTypes: RetrievedChunk['metadata']['type'][] = ['project', 'experience', 'education'];

  chunks.forEach((chunk) => {
    // Filter out non-clickable types (skills, FAQs, stories, etc.)
    if (!clickableTypes.includes(chunk.metadata.type)) {
      return;
    }

    if (!seenIds.has(chunk.metadata.itemId)) {
      seenIds.add(chunk.metadata.itemId);

      citations.push({
        type: chunk.metadata.type,
        id: chunk.metadata.itemId,
        title: chunk.metadata.title,
      });
    }
  });

  return citations;
}

/**
 * Formats retrieved chunks for context in prompt
 */
export function formatChunksForContext(chunks: RetrievedChunk[]): string {
  return chunks
    .map((chunk, index) => {
      const metadata = chunk.metadata;
      let header = `[${index + 1}] ${metadata.title}`;
      
      if (metadata.type === 'project' && metadata.category) {
        header += ` (${metadata.category})`;
      }
      if (metadata.year) {
        header += ` - ${metadata.year}`;
      }

      return `${header}\n${chunk.content}`;
    })
    .join('\n\n---\n\n');
}

