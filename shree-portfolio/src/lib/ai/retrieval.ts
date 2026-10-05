import { generateEmbedding } from './embeddings';
import { searchSimilar } from './vector-store';
import { Citation } from '@/data/types';
import { AI_CONFIG } from './config';
import { projects, experiences, education, personalInfo } from '@/data/portfolio';
import { chunkAllContent } from './chunking';

// Saved embeddings rank candidates; the current approved catalog supplies every
// word and citation sent to the model. A content refresh must never keep serving
// superseded text while an explicit (paid) reindex is still pending.
const currentChunks = new Map(
  chunkAllContent(projects, experiences, education, personalInfo)
    .map((chunk) => [chunk.id, chunk])
);

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

  // IDs are stable across edits. Reject retired IDs and mismatched identity
  // metadata rather than accidentally attaching an old row to another item.
  // Scores still describe the saved embeddings; reindexing remains necessary
  // for updated semantic ranking and recall of newly added projects.
  const seen = new Set<string>();
  let chunks: RetrievedChunk[] = results.flatMap((result) => {
    const current = currentChunks.get(result.id);
    if (!current || seen.has(result.id) ||
      result.metadata?.type !== current.metadata.type ||
      result.metadata?.itemId !== current.metadata.itemId) return [];
    if (options.filter?.type && current.metadata.type !== options.filter.type) return [];
    if (options.filter?.itemId && current.metadata.itemId !== options.filter.itemId) return [];
    if (options.filter?.category && current.metadata.category !== options.filter.category) return [];
    seen.add(result.id);
    return [{
      content: current.content,
      metadata: current.metadata,
      similarity: result.similarity,
    }];
  });

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
  const seen = new Set<string>();

  // Every chunk type can cite. Project/experience/education citations open the
  // detail panel; the rest are labels that show which part of the site an answer
  // came from. Previously only the three clickable types could cite, so answers
  // built from bio/FAQ/story chunks — about half the index — shipped with an
  // empty citation list and no way to tell sourced text from unsourced text.
  chunks.forEach((chunk) => {
    const key = `${chunk.metadata.type}:${chunk.metadata.itemId}`;
    if (seen.has(key)) return;
    seen.add(key);

    citations.push({
      type: chunk.metadata.type,
      id: chunk.metadata.itemId,
      title: chunk.metadata.title,
    });
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
