import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ContentChunk } from './chunking';

// Lazy-loaded Supabase client (created on first use, after env vars are loaded)
let supabase: SupabaseClient | null = null;
let supabaseInitialized = false;

function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseInitialized) {
    supabaseInitialized = true;
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    } else {
      console.warn('Supabase credentials not found. Vector store operations will fail.');
    }
  }
  return supabase;
}

export interface EmbeddingRecord {
  id: string;
  content: string;
  embedding: number[];
  metadata: ContentChunk['metadata'];
  created_at?: string;
}

/**
 * Upserts embeddings into the vector database
 */
export async function upsertEmbeddings(
  chunks: Array<ContentChunk & { embedding: number[] }>
): Promise<void> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client not initialized. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }

  const records: EmbeddingRecord[] = chunks.map((chunk) => ({
    id: chunk.id,
    content: chunk.content,
    embedding: chunk.embedding,
    metadata: chunk.metadata,
  }));

  // Supabase allows up to 1000 rows per insert, so we batch if needed
  const BATCH_SIZE = 1000;
  
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    
    const { error } = await client
      .from('portfolio_embeddings')
      .upsert(batch, {
        onConflict: 'id',
      });

    if (error) {
      console.error(`Error upserting batch ${i}-${i + BATCH_SIZE}:`, error);
      throw new Error(`Failed to upsert embeddings: ${error.message}`);
    }
  }
}

/**
 * Searches for similar content using vector similarity
 */
export async function searchSimilar(
  queryEmbedding: number[],
  options: {
    limit?: number;
    minScore?: number;
    filter?: {
      type?: 'project' | 'experience' | 'education' | 'skill' | 'bio' | 'faq' | 'story' | 'philosophy' | 'interests' | 'workstyle';
      itemId?: string;
      category?: string;
    };
  } = {}
): Promise<Array<EmbeddingRecord & { similarity: number }>> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client not initialized. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }

  const limit = options.limit || 10;
  const minScore = options.minScore ?? 0.5;

  // Build filter conditions for metadata
  let filterConditions = '';
  if (options.filter) {
    const filters: string[] = [];
    if (options.filter.type) {
      filters.push(`metadata->>'type' = '${options.filter.type}'`);
    }
    if (options.filter.itemId) {
      filters.push(`metadata->>'itemId' = '${options.filter.itemId}'`);
    }
    if (options.filter.category) {
      filters.push(`metadata->>'category' = '${options.filter.category}'`);
    }
    if (filters.length > 0) {
      filterConditions = `AND ${filters.join(' AND ')}`;
    }
  }

  // Use RPC function for vector search, then filter in SQL
  const { data, error } = await client.rpc('match_portfolio_embeddings', {
    query_embedding: queryEmbedding,
    match_threshold: minScore,
    match_count: limit * 2, // Get more results to account for filtering
  });

  if (error) {
    console.error('Error searching embeddings:', error);
    throw new Error(`Failed to search embeddings: ${error.message}`);
  }

  // Apply filters in JavaScript if needed (fallback if SQL filtering doesn't work)
  let results = (data || []) as Array<{
    id: string;
    content: string;
    metadata: any;
    similarity: number;
  }>;

  if (options.filter) {
    results = results.filter((item) => {
      if (options.filter?.type && item.metadata?.type !== options.filter.type) {
        return false;
      }
      if (options.filter?.itemId && item.metadata?.itemId !== options.filter.itemId) {
        return false;
      }
      if (options.filter?.category && item.metadata?.category !== options.filter.category) {
        return false;
      }
      return true;
    });
  }

  // Limit results
  results = results.slice(0, limit);

  return results.map((item) => ({
    id: item.id,
    content: item.content,
    embedding: [], // Not needed in response
    metadata: item.metadata,
    similarity: item.similarity || 0,
  }));
}

/**
 * Deletes all embeddings (useful for re-indexing)
 */
export async function deleteAllEmbeddings(): Promise<void> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client not initialized. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }

  const { error } = await client
    .from('portfolio_embeddings')
    .delete()
    .neq('id', ''); // Delete all rows

  if (error) {
    console.error('Error deleting embeddings:', error);
    throw new Error(`Failed to delete embeddings: ${error.message}`);
  }
}

/**
 * Gets embedding count
 */
export async function getEmbeddingCount(): Promise<number> {
  const client = getSupabaseClient();
  if (!client) {
    return 0;
  }

  const { count, error } = await client
    .from('portfolio_embeddings')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error counting embeddings:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Checks if vector store is available
 */
export function isVectorStoreAvailable(): boolean {
  return getSupabaseClient() !== null;
}

