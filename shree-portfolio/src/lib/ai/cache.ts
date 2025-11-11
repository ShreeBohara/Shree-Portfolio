/**
 * Simple in-memory cache for embeddings and query responses
 * For production, consider using Redis or a more robust caching solution
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const embeddingCache = new Map<string, CacheEntry<number[]>>();
const queryCache = new Map<string, CacheEntry<string>>();

// Cache TTLs
const EMBEDDING_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours (embeddings don't change)
const QUERY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes (for query responses)

/**
 * Gets cached embedding or null if not found/expired
 */
export function getCachedEmbedding(text: string): number[] | null {
  const key = text.toLowerCase().trim();
  const entry = embeddingCache.get(key);

  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    embeddingCache.delete(key);
    return null;
  }

  return entry.value;
}

/**
 * Caches an embedding
 */
export function setCachedEmbedding(text: string, embedding: number[]): void {
  const key = text.toLowerCase().trim();
  embeddingCache.set(key, {
    value: embedding,
    expiresAt: Date.now() + EMBEDDING_CACHE_TTL,
  });
}

/**
 * Gets cached query response or null if not found/expired
 */
export function getCachedQueryResponse(query: string, context?: any): string | null {
  const key = JSON.stringify({ query: query.toLowerCase().trim(), context });
  const entry = queryCache.get(key);

  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    queryCache.delete(key);
    return null;
  }

  return entry.value;
}

/**
 * Caches a query response
 */
export function setCachedQueryResponse(query: string, response: string, context?: any): void {
  const key = JSON.stringify({ query: query.toLowerCase().trim(), context });
  queryCache.set(key, {
    value: response,
    expiresAt: Date.now() + QUERY_CACHE_TTL,
  });
}

/**
 * Clears all caches
 */
export function clearCache(): void {
  embeddingCache.clear();
  queryCache.clear();
}

/**
 * Cleans up expired cache entries
 */
export function cleanupCache(): void {
  const now = Date.now();

  // Clean embedding cache
  for (const [key, entry] of embeddingCache.entries()) {
    if (now > entry.expiresAt) {
      embeddingCache.delete(key);
    }
  }

  // Clean query cache
  for (const [key, entry] of queryCache.entries()) {
    if (now > entry.expiresAt) {
      queryCache.delete(key);
    }
  }
}

// Cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupCache, 10 * 60 * 1000);
}

/**
 * Gets cache statistics
 */
export function getCacheStats() {
  return {
    embeddingCacheSize: embeddingCache.size,
    queryCacheSize: queryCache.size,
  };
}

