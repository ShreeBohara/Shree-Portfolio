# AI/RAG System Documentation

## Overview

The AI system uses **Retrieval-Augmented Generation (RAG)** to provide accurate, contextual answers about Shree's portfolio. It combines vector search (retrieval) with GPT-4o-mini (generation) to ground responses in actual portfolio content.

## Architecture

```
User Query
    │
    ▼
┌─────────────────────────────────────────┐
│  1. RETRIEVAL PHASE                     │
│  ─────────────────────────────────────  │
│  • Generate query embedding             │
│  • Search vector store (Supabase)       │
│  • Return top 15 chunks (min 0.4 score) │
│  • Apply context filters if enabled     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  2. PROMPT BUILDING                     │
│  ─────────────────────────────────────  │
│  • System prompt (personality)          │
│  • User prompt (context + query)        │
│  • Format retrieved chunks              │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  3. GENERATION PHASE                    │
│  ─────────────────────────────────────  │
│  • Call OpenAI GPT-4o-mini              │
│  • Stream response chunks               │
│  • Extract citations                    │
└─────────────────┬───────────────────────┘
                  │
                  ▼
              Response
```

## File Structure

```
src/lib/ai/
├── rag.ts              # Main RAG orchestration
├── retrieval.ts        # Vector search & citation extraction
├── prompts.ts          # System & user prompt building
├── embeddings.ts       # Embedding generation
├── vector-store.ts     # Supabase pgvector interface
├── client.ts           # OpenAI client initialization
├── config.ts           # AI configuration constants
├── rate-limit.ts       # Rate limiting logic
├── cache.ts            # Response caching (future)
├── chunking.ts         # Content chunking utilities
└── rag-placeholder.ts  # Fallback responses
```

## Configuration (config.ts)

### Model Settings

```typescript
export const AI_CONFIG = {
  // Model
  model: 'gpt-4o-mini',        // Cost-efficient, fast
  temperature: 0.8,             // Higher = more creative/conversational
  maxTokens: 1500,              // ~25% shorter than default
  
  // Embeddings
  embedding: {
    model: 'text-embedding-3-small',
    dimensions: 1536,
  },
  
  // Retrieval
  retrieval: {
    topK: 15,                   // Retrieve top 15 chunks
    minScore: 0.4,              // Minimum similarity (0-1)
    contextWindow: 4000,        // Max tokens for context
  },
  
  // System Prompt
  systemPrompt: `You are Shree Bohara's portfolio assistant...`,
  
  // Formatting
  formatting: {
    useBulletPoints: true,
    maxBullets: 4,
    includeNextActions: true,
    citeSources: true,
    preferShortParagraphs: true,
    maxParagraphs: 3,
  },
}
```

### Why These Settings?

- **GPT-4o-mini:** 60% cheaper than GPT-4, 2x faster, sufficient for portfolio Q&A
- **Temperature 0.8:** Balances accuracy with natural conversation
- **Max 1500 tokens:** Keeps responses concise (2-4 paragraphs)
- **Top 15 chunks:** Comprehensive context without overwhelming the model
- **Min score 0.4:** Inclusive threshold (better recall over precision)

## RAG Implementation (rag.ts)

### Main Function: getRAGResponse()

```typescript
export async function getRAGResponse(
  query: string,
  context?: ChatContext
): Promise<RAGResponse>
```

**Steps:**

1. **Check Vector Store Availability**
   ```typescript
   if (!isVectorStoreAvailable()) {
     return getAIResponse(query, context); // Fallback
   }
   ```

2. **Retrieve Relevant Content**
   ```typescript
   const retrievedChunks = await retrieveRelevantContent(query, {
     limit: 15,
     filter: context?.enabled ? { type, itemId } : undefined,
     boostItemId: context?.itemId,
   });
   ```

3. **Extract Citations**
   ```typescript
   const citations = extractCitations(retrievedChunks);
   ```

4. **Build Messages**
   ```typescript
   const messages = buildMessages(query, retrievedChunks, context);
   ```

5. **Generate Response**
   ```typescript
   const completion = await openai.chat.completions.create({
     model: AI_CONFIG.model,
     messages,
     temperature: AI_CONFIG.temperature,
     max_tokens: AI_CONFIG.maxTokens,
   });
   ```

6. **Calculate Confidence**
   ```typescript
   const avgSimilarity = chunks.reduce((sum, c) => sum + c.similarity, 0) / chunks.length;
   const confidence = Math.min(avgSimilarity, 0.95);
   ```

### Streaming Function: streamRAGResponse()

```typescript
export async function* streamRAGResponse(
  query: string,
  context?: ChatContext
): AsyncGenerator<string, void, unknown>
```

**Differences from getRAGResponse():**

- Returns async generator (yields chunks)
- Uses `stream: true` in OpenAI call
- Yields content as it arrives
- Fallback streams word-by-word

**Usage:**
```typescript
for await (const chunk of streamRAGResponse(query, context)) {
  console.log(chunk); // "Hello ", "world", "!"
}
```

## Retrieval System (retrieval.ts)

### Vector Search

```typescript
export async function retrieveRelevantContent(
  query: string,
  options?: {
    limit?: number;           // Default 15
    minScore?: number;        // Default 0.4
    filter?: {
      type?: string;
      itemId?: string;
    };
    boostItemId?: string;     // Boost specific item
  }
): Promise<RetrievedChunk[]>
```

**Process:**

1. **Generate Query Embedding**
   ```typescript
   const queryEmbedding = await generateEmbedding(query);
   ```

2. **Build Supabase Query**
   ```typescript
   let query = supabase
     .rpc('match_portfolio_embeddings', {
       query_embedding: queryEmbedding,
       match_threshold: minScore,
       match_count: limit,
     });
   
   // Apply filters
   if (filter?.type) {
     query = query.eq('metadata->type', filter.type);
   }
   if (filter?.itemId) {
     query = query.eq('metadata->itemId', filter.itemId);
   }
   ```

3. **Execute Search**
   ```typescript
   const { data, error } = await query;
   ```

4. **Boost Specific Item** (if context-aware)
   ```typescript
   if (boostItemId) {
     chunks.sort((a, b) => {
       const aMatch = a.metadata.itemId === boostItemId;
       const bMatch = b.metadata.itemId === boostItemId;
       if (aMatch && !bMatch) return -1;
       if (!aMatch && bMatch) return 1;
       return b.similarity - a.similarity;
     });
   }
   ```

5. **Return Chunks**
   ```typescript
   return chunks.map(chunk => ({
     content: chunk.content,
     similarity: chunk.similarity,
     metadata: chunk.metadata,
   }));
   ```

### Citation Extraction

```typescript
export function extractCitations(chunks: RetrievedChunk[]): Citation[]
```

**Logic:**

1. Group chunks by unique item (itemId + type)
2. Take highest similarity chunk per item
3. Map to Citation format:
   ```typescript
   {
     type: 'project' | 'experience' | 'education' | ...,
     id: string,
     title: string,
     url?: string,
   }
   ```

**Example:**
```typescript
// Input: 15 chunks (5 from Project A, 7 from Project B, 3 from Experience C)
// Output: 3 citations (Project A, Project B, Experience C)
```

### Chunk Formatting

```typescript
export function formatChunksForContext(chunks: RetrievedChunk[]): string
```

**Output Format:**
```
[Project: AI Resume Builder]
Implemented an AI-driven resume builder using React and OpenAI APIs...
(Similarity: 0.87)

[Experience: QuinStreet - Software Engineer]
Shipped Pond from Figma to production in under 3 months...
(Similarity: 0.82)

[FAQ: Tell me about yourself]
I'm Shree Bohara, a Computer Science graduate student at USC...
(Similarity: 0.79)
```

## Prompt System (prompts.ts)

### System Prompt

**Purpose:** Define AI personality, tone, and guidelines

**Key Elements:**

1. **Identity**
   ```
   You are Shree Bohara's portfolio assistant.
   ```

2. **Personality**
   ```
   - Conversational and warm
   - Enthusiastic about his work
   - Professional yet casual
   - Helpful and eager to connect
   ```

3. **Conciseness Guidelines**
   ```
   - Keep responses short (2-4 paragraphs max)
   - Lead with most important info
   - Use bullet points (3-5 items max)
   - Get to the point quickly
   ```

4. **Information Usage**
   ```
   - Prioritize provided portfolio context
   - For general questions, provide brief context + connect to Shree
   - If not in portfolio, suggest booking a call
   ```

5. **When to Suggest Calendly**
   ```
   - Salary/compensation questions
   - Detailed interview availability
   - After answering 2-3 questions successfully
   - Deep technical discussions beyond portfolio
   ```

### User Prompt

**Purpose:** Provide context + query to AI

**Structure:**

```typescript
function buildUserPrompt(query, chunks, context) {
  let prompt = '';
  
  // 1. Context note (if viewing specific item)
  if (context?.enabled) {
    prompt += `[Note: Visitor is viewing this ${context.itemType}]\n\n`;
  }
  
  // 2. Retrieved portfolio information
  if (chunks.length > 0) {
    prompt += `Here's relevant information from Shree's portfolio:\n\n`;
    prompt += `---\n\n`;
    prompt += formatChunksForContext(chunks);
    prompt += `\n---\n\n`;
  } else {
    prompt += `[No specific content retrieved, but provide helpful response]\n\n`;
  }
  
  // 3. User's question
  prompt += `Visitor's Question: "${query}"\n\n`;
  
  // 4. Response guidelines
  prompt += `Response Guidelines:\n`;
  prompt += `• Keep it SHORT (2-4 paragraphs max)\n`;
  prompt += `• Lead with key facts: metrics, technologies, impact\n`;
  prompt += `• Tell stories briefly (1-2 sentences)\n`;
  prompt += `• Use 3-4 bullet points max\n`;
  prompt += `• If salary/availability, suggest booking a call\n`;
  
  return prompt;
}
```

**Example Full Prompt:**

```
[System]
You are Shree Bohara's portfolio assistant. Your goal is to help visitors...

[User]
Here's relevant information from Shree's portfolio:

---

[Project: Pond - AI Insurance Platform]
Shipped Pond from Figma to production in under 3 months (live at insurance.com/pond)...
(Similarity: 0.89)

[Experience: QuinStreet - Software Engineer]
Redesigned 23-step React onboarding flow with summaries and inline edits...
(Similarity: 0.85)

---

Visitor's Question: "Tell me about your work at QuinStreet"

Response Guidelines:
• Keep it SHORT (2-4 paragraphs max)
• Lead with key facts: metrics, technologies, impact
...
```

## Embeddings (embeddings.ts)

### Generate Embedding

```typescript
export async function generateEmbedding(text: string): Promise<number[]>
```

**Process:**

1. **Call OpenAI Embeddings API**
   ```typescript
   const response = await openai.embeddings.create({
     model: 'text-embedding-3-small',
     input: text,
   });
   ```

2. **Extract Vector**
   ```typescript
   const embedding = response.data[0].embedding; // 1536 dimensions
   ```

3. **Return**
   ```typescript
   return embedding; // [0.123, -0.456, 0.789, ...]
   ```

### Batch Embeddings

```typescript
export async function generateBatchEmbeddings(
  texts: string[]
): Promise<number[][]>
```

**Optimization:**
- Processes up to 2048 texts per request
- Reduces API calls by 100x
- Used during initial indexing

## Vector Store (vector-store.ts)

### Supabase Integration

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

### Store Embedding

```typescript
export async function storeEmbedding(
  content: string,
  embedding: number[],
  metadata: EmbeddingMetadata
): Promise<void>
```

**SQL Equivalent:**
```sql
INSERT INTO portfolio_embeddings (content, embedding, metadata)
VALUES ($1, $2::vector, $3::jsonb);
```

### Search Embeddings

```typescript
export async function searchEmbeddings(
  queryEmbedding: number[],
  options: SearchOptions
): Promise<SearchResult[]>
```

**Uses Supabase RPC:**
```sql
CREATE OR REPLACE FUNCTION match_portfolio_embeddings(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    portfolio_embeddings.id,
    portfolio_embeddings.content,
    portfolio_embeddings.metadata,
    1 - (portfolio_embeddings.embedding <=> query_embedding) AS similarity
  FROM portfolio_embeddings
  WHERE 1 - (portfolio_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY portfolio_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

**Similarity Calculation:**
- Uses cosine similarity: `1 - (embedding <=> query_embedding)`
- `<=>` is pgvector's cosine distance operator
- Result: 0 (dissimilar) to 1 (identical)

### Check Availability

```typescript
export function isVectorStoreAvailable(): boolean {
  return !!(
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
```

## Rate Limiting (rate-limit.ts)

### Implementation

```typescript
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const RATE_LIMIT = {
  maxRequests: 20,
  windowMs: 60 * 60 * 1000, // 1 hour
};
```

### Check Rate Limit

```typescript
export function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientId);
  
  // No entry or expired
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    });
    return true;
  }
  
  // Within limit
  if (entry.count < RATE_LIMIT.maxRequests) {
    entry.count++;
    return true;
  }
  
  // Exceeded limit
  return false;
}
```

### Get Remaining Requests

```typescript
export function getRemainingRequests(clientId: string): number {
  const entry = rateLimitMap.get(clientId);
  if (!entry) return RATE_LIMIT.maxRequests;
  return Math.max(0, RATE_LIMIT.maxRequests - entry.count);
}
```

## Content Chunking (chunking.ts)

### Chunk Text

```typescript
export function chunkText(
  text: string,
  options: {
    maxChunkSize: number;  // Default 500
    overlap: number;       // Default 50
  }
): string[]
```

**Algorithm:**

1. Split by sentences (using `.`, `!`, `?`)
2. Accumulate sentences until maxChunkSize
3. Add overlap from previous chunk
4. Return array of chunks

**Example:**
```typescript
const text = "Sentence 1. Sentence 2. Sentence 3. Sentence 4.";
const chunks = chunkText(text, { maxChunkSize: 30, overlap: 10 });
// Result:
// ["Sentence 1. Sentence 2.", "Sentence 2. Sentence 3.", "Sentence 3. Sentence 4."]
```

### Chunk Portfolio Content

```typescript
export function chunkPortfolioContent(
  item: Project | Experience | Education,
  type: 'project' | 'experience' | 'education'
): ChunkedContent[]
```

**Process:**

1. Extract all text fields (summary, problem, approach, highlights, etc.)
2. Chunk each field separately
3. Attach metadata (type, itemId, title, category, year, tags)
4. Return array of chunks with metadata

**Example Output:**
```typescript
[
  {
    content: "Built an intelligent customer support system...",
    metadata: {
      type: 'project',
      itemId: 'project-1',
      title: 'AI Customer Support Platform',
      category: 'AI/ML',
      year: 2024,
      tags: ['AI', 'NLP', 'Customer Support'],
    }
  },
  // ... more chunks
]
```

## Fallback System (rag-placeholder.ts)

### When Used

- Vector store unavailable (missing env vars)
- Supabase connection fails
- OpenAI API errors
- Embedding generation fails

### Implementation

```typescript
export async function getAIResponse(
  query: string,
  context?: ChatContext
): Promise<RAGResponse> {
  // Simple keyword matching
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('project')) {
    return {
      answer: "I've worked on several exciting projects...",
      citations: [...],
      confidence: 0.7,
    };
  }
  
  // Default response
  return {
    answer: "I'd be happy to discuss that in detail...",
    citations: [],
    confidence: 0.5,
  };
}
```

## Debugging & Logging

### Console Logs

```typescript
// Retrieval
console.log(`[RAG] Query: "${query}"`);
console.log(`[RAG] Retrieved ${chunks.length} chunks`);
console.log(`[RAG] Top chunk similarity: ${chunks[0].similarity.toFixed(3)}`);

// Streaming
console.log(`[RAG Stream] Query: "${query}"`);
console.log(`[RAG Stream] Retrieved ${chunks.length} chunks`);

// Errors
console.error('RAG error:', error);
console.warn('Vector store not available, using placeholder');
```

### Monitoring Recommendations

1. **Track Metrics:**
   - Query latency (retrieval + generation)
   - Chunk retrieval count
   - Average similarity scores
   - Fallback usage rate

2. **Log Events:**
   - Failed retrievals
   - OpenAI API errors
   - Rate limit hits
   - Low confidence responses

3. **Alerts:**
   - High error rate (>5%)
   - Slow responses (>10s)
   - Vector store downtime
   - OpenAI quota exceeded

## Performance Optimization

### Current Optimizations

1. **Streaming:** Reduces perceived latency
2. **Batch Embeddings:** 100x fewer API calls during indexing
3. **Vector Index:** Fast similarity search (ivfflat)
4. **Top-K Limiting:** Only retrieve 15 chunks
5. **Minimum Score:** Skip irrelevant chunks

### Future Optimizations

1. **Response Caching:** Cache common queries
2. **Embedding Caching:** Reuse query embeddings
3. **Lazy Loading:** Load chunks on-demand
4. **Compression:** Compress stored embeddings
5. **CDN:** Cache static responses

## Testing Strategies

### Unit Tests

```typescript
describe('retrieveRelevantContent', () => {
  it('should return top K chunks', async () => {
    const chunks = await retrieveRelevantContent('test query', { limit: 5 });
    expect(chunks).toHaveLength(5);
  });
  
  it('should filter by type', async () => {
    const chunks = await retrieveRelevantContent('test', {
      filter: { type: 'project' }
    });
    expect(chunks.every(c => c.metadata.type === 'project')).toBe(true);
  });
});
```

### Integration Tests

```typescript
describe('RAG System', () => {
  it('should generate response with citations', async () => {
    const response = await getRAGResponse('Tell me about your projects');
    expect(response.answer).toBeTruthy();
    expect(response.citations.length).toBeGreaterThan(0);
    expect(response.confidence).toBeGreaterThan(0.5);
  });
});
```

### E2E Tests

```typescript
describe('Chat API', () => {
  it('should stream response', async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ query: 'test', stream: true }),
    });
    
    const reader = response.body.getReader();
    const chunks = [];
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    
    expect(chunks.length).toBeGreaterThan(0);
  });
});
```
