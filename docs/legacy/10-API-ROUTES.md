# API Routes Documentation

## Overview

API routes handle server-side logic including chat responses, embeddings generation, and reindexing. Built with Next.js App Router API routes.

## File Structure

```
src/app/api/
├── chat/
│   └── route.ts           # Main chat endpoint (streaming)
└── admin/
    ├── embeddings/
    │   └── route.ts       # Generate embeddings
    └── reindex/
        └── route.ts       # Reindex vector store
```

## Chat Endpoint

### POST /api/chat

**File:** `src/app/api/chat/route.ts`

**Purpose:** Handle chat queries with streaming AI responses

**Runtime:** Node.js (for Supabase compatibility)

**Request Body:**
```typescript
{
  query: string;                    // User's question
  context?: {                       // Optional context
    enabled: boolean;
    itemType: 'project' | 'experience' | 'education';
    itemId: string;
  };
  stream?: boolean;                 // Default true
}
```

**Response (Streaming):**
```
# Line 1: Metadata with citations
{"type":"metadata","citations":[...]}

# Lines 2-N: Content chunks
{"type":"chunk","content":"Hello "}
{"type":"chunk","content":"world"}

# Last line: Completion marker
{"type":"done"}
```

**Response (Non-streaming):**
```typescript
{
  answer: string;
  citations: Citation[];
  confidence: number;
}
```

**Implementation:**
```typescript
import { NextRequest } from 'next/server';
import { streamRAGResponse, getRAGResponse } from '@/lib/ai/rag';
import { extractCitations, retrieveRelevantContent } from '@/lib/ai/retrieval';
import { checkRateLimit, getRemainingRequests, getResetTime } from '@/lib/ai/rate-limit';

export const runtime = 'nodejs';

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  return ip;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const clientId = getClientIdentifier(request);
    if (!checkRateLimit(clientId)) {
      const remaining = getRemainingRequests(clientId);
      const resetTime = getResetTime(clientId);
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `Too many requests. Please try again after ${new Date(resetTime).toISOString()}`,
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': resetTime.toString(),
          },
        }
      );
    }

    // 2. Parse request
    const { query, context, stream: shouldStream = true } = await request.json();

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Streaming response
    if (shouldStream) {
      // Retrieve citations first
      const retrievedChunks = await retrieveRelevantContent(query, {
        limit: 7,
        filter: context?.enabled && context?.itemId
          ? {
              type: context.itemType,
              itemId: context.itemId,
            }
          : undefined,
        boostItemId: context?.enabled ? context.itemId : undefined,
      });
      const citations = extractCitations(retrievedChunks);

      // Create readable stream
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Send metadata
            const metadata = JSON.stringify({ type: 'metadata', citations }) + '\n';
            controller.enqueue(encoder.encode(metadata));

            // Stream response
            for await (const chunk of streamRAGResponse(query, context)) {
              const data = JSON.stringify({ type: 'chunk', content: chunk }) + '\n';
              controller.enqueue(encoder.encode(data));
            }

            // Send completion
            const done = JSON.stringify({ type: 'done' }) + '\n';
            controller.enqueue(encoder.encode(done));
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            const errorData = JSON.stringify({
              type: 'error',
              error: error instanceof Error ? error.message : 'Streaming failed',
            }) + '\n';
            controller.enqueue(encoder.encode(errorData));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // 4. Non-streaming response
      const response = await getRAGResponse(query, context);
      return new Response(
        JSON.stringify(response),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
```

**Rate Limiting:**
- 20 requests per hour per IP
- Returns 429 with retry-after header
- Includes rate limit headers in response

**Error Handling:**
- 400: Invalid request (missing query)
- 429: Rate limit exceeded
- 500: Internal server error

**Headers:**
- `Content-Type: text/event-stream` (streaming)
- `Content-Type: application/json` (non-streaming)
- `Cache-Control: no-cache`
- `X-RateLimit-Limit: 20`
- `X-RateLimit-Remaining: <count>`
- `X-RateLimit-Reset: <timestamp>`

## Admin Endpoints

### POST /api/admin/embeddings

**File:** `src/app/api/admin/embeddings/route.ts`

**Purpose:** Generate embeddings for portfolio content

**Request Body:**
```typescript
{
  content: string;      // Text to embed
  metadata?: object;    // Optional metadata
}
```

**Response:**
```typescript
{
  embedding: number[];  // 1536-dimensional vector
  metadata: object;
}
```

**Implementation:**
```typescript
import { NextRequest } from 'next/server';
import { generateEmbedding } from '@/lib/ai/embeddings';

export async function POST(request: NextRequest) {
  try {
    const { content, metadata } = await request.json();

    if (!content || typeof content !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const embedding = await generateEmbedding(content);

    return new Response(
      JSON.stringify({ embedding, metadata }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Embeddings API error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

### POST /api/admin/reindex

**File:** `src/app/api/admin/reindex/route.ts`

**Purpose:** Reindex all portfolio content in vector store

**Request Body:**
```typescript
{
  force?: boolean;  // Force reindex even if exists
}
```

**Response:**
```typescript
{
  success: boolean;
  indexed: number;      // Number of chunks indexed
  duration: number;     // Time taken (ms)
}
```

**Implementation:**
```typescript
import { NextRequest } from 'next/server';
import { chunkPortfolioContent } from '@/lib/ai/chunking';
import { generateBatchEmbeddings } from '@/lib/ai/embeddings';
import { storeEmbedding } from '@/lib/ai/vector-store';
import { projects, experiences, education, personalInfo } from '@/data/portfolio';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { force = false } = await request.json();

    // 1. Chunk all content
    const chunks = [
      ...projects.flatMap(p => chunkPortfolioContent(p, 'project')),
      ...experiences.flatMap(e => chunkPortfolioContent(e, 'experience')),
      ...education.flatMap(e => chunkPortfolioContent(e, 'education')),
      // Add personal info chunks
    ];

    // 2. Generate embeddings
    const contents = chunks.map(c => c.content);
    const embeddings = await generateBatchEmbeddings(contents);

    // 3. Store in vector store
    for (let i = 0; i < chunks.length; i++) {
      await storeEmbedding(chunks[i].content, embeddings[i], chunks[i].metadata);
    }

    const duration = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        success: true,
        indexed: chunks.length,
        duration,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Reindex API error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

## Client-Side Usage

### Chat Query

```typescript
async function sendChatQuery(query: string, context?: ChatContext) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      context,
      stream: true,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      const data = await response.json();
      throw new Error(`Rate limit exceeded. Retry after ${data.retryAfter}s`);
    }
    throw new Error(`API error: ${response.statusText}`);
  }

  // Handle streaming
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim());

    for (const line of lines) {
      const data = JSON.parse(line);

      if (data.type === 'metadata') {
        console.log('Citations:', data.citations);
      } else if (data.type === 'chunk') {
        console.log('Content:', data.content);
      } else if (data.type === 'done') {
        console.log('Streaming complete');
      }
    }
  }
}
```

### Generate Embeddings

```typescript
async function generateEmbeddings(content: string, metadata?: object) {
  const response = await fetch('/api/admin/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, metadata }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.embedding;
}
```

### Reindex Content

```typescript
async function reindexContent(force = false) {
  const response = await fetch('/api/admin/reindex', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ force }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`Indexed ${data.indexed} chunks in ${data.duration}ms`);
}
```

## Error Handling

### Client-Side

```typescript
try {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      // Rate limit exceeded
      const data = await response.json();
      alert(`Too many requests. Retry after ${data.retryAfter}s`);
    } else if (response.status === 400) {
      // Bad request
      alert('Invalid request');
    } else {
      // Server error
      alert('Something went wrong');
    }
    return;
  }

  // Handle success
} catch (error) {
  // Network error
  console.error('Network error:', error);
  alert('Failed to connect to server');
}
```

### Server-Side

```typescript
export async function POST(request: NextRequest) {
  try {
    // ... logic
  } catch (error) {
    console.error('API error:', error);
    
    // Log to monitoring service
    // await logError(error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
```

## Security

### Rate Limiting

**Implementation:**
- IP-based identification
- 20 requests per hour
- In-memory storage (resets on server restart)
- Returns 429 with retry-after

**Improvements:**
- Use Redis for distributed rate limiting
- Per-user rate limits (if auth added)
- Different limits for different endpoints

### Input Validation

```typescript
// Validate query
if (!query || typeof query !== 'string') {
  return new Response(
    JSON.stringify({ error: 'Query is required' }),
    { status: 400 }
  );
}

// Validate query length
if (query.length > 1000) {
  return new Response(
    JSON.stringify({ error: 'Query too long' }),
    { status: 400 }
  );
}

// Sanitize input (if needed)
const sanitizedQuery = query.trim();
```

### API Keys

**Current:**
- OpenAI API key in environment variables
- Supabase service role key in environment variables
- Never exposed to client

**Best Practices:**
- Use server-side only (runtime: 'nodejs')
- Rotate keys regularly
- Monitor usage
- Set spending limits

### CORS

**Default:** Next.js allows same-origin only

**Custom CORS (if needed):**
```typescript
export async function POST(request: NextRequest) {
  const response = await handleRequest(request);
  
  response.headers.set('Access-Control-Allow-Origin', 'https://yourdomain.com');
  response.headers.set('Access-Control-Allow-Methods', 'POST');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}
```

## Performance

### Caching

**Response Caching:**
```typescript
// Cache common queries
const cache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  const { query } = await request.json();
  
  // Check cache
  const cached = cache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return new Response(cached.response, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Generate response
  const response = await getRAGResponse(query);
  
  // Store in cache
  cache.set(query, {
    response: JSON.stringify(response),
    timestamp: Date.now(),
  });
  
  return new Response(JSON.stringify(response));
}
```

### Streaming

**Benefits:**
- Reduces time to first byte
- Better perceived performance
- Lower memory usage

**Implementation:**
```typescript
const stream = new ReadableStream({
  async start(controller) {
    for await (const chunk of streamRAGResponse(query)) {
      controller.enqueue(encoder.encode(chunk));
    }
    controller.close();
  },
});

return new Response(stream, {
  headers: { 'Content-Type': 'text/event-stream' },
});
```

## Monitoring

### Logging

```typescript
// Log requests
console.log(`[${new Date().toISOString()}] POST /api/chat - ${clientId}`);

// Log errors
console.error(`[${new Date().toISOString()}] Error:`, error);

// Log performance
const startTime = Date.now();
// ... logic
const duration = Date.now() - startTime;
console.log(`Request completed in ${duration}ms`);
```

### Metrics

**Track:**
- Request count
- Error rate
- Response time
- Rate limit hits
- Cache hit rate

**Tools:**
- Vercel Analytics
- Sentry for errors
- Custom logging service

## Testing

### Unit Tests

```typescript
import { POST } from '@/app/api/chat/route';

describe('POST /api/chat', () => {
  it('should return 400 for missing query', async () => {
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
  
  it('should return 429 for rate limit exceeded', async () => {
    // Make 21 requests
    for (let i = 0; i < 21; i++) {
      const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ query: 'test' }),
      });
      
      const response = await POST(request);
      
      if (i < 20) {
        expect(response.status).toBe(200);
      } else {
        expect(response.status).toBe(429);
      }
    }
  });
});
```

### Integration Tests

```typescript
describe('Chat API Integration', () => {
  it('should stream response', async () => {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ query: 'test', stream: true }),
    });
    
    expect(response.ok).toBe(true);
    expect(response.headers.get('content-type')).toBe('text/event-stream');
    
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

## Deployment

### Environment Variables

**Required:**
```bash
OPENAI_API_KEY=sk-proj-...
SUPABASE_URL=https://....supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add each variable
3. Redeploy

### Edge vs Node Runtime

**Current:** Node.js runtime (for Supabase)

**Edge Runtime (if switching):**
```typescript
export const runtime = 'edge';
```

**Benefits:**
- Lower latency
- Global distribution
- Lower cost

**Limitations:**
- No Node.js APIs
- Smaller bundle size limit
- Some libraries incompatible

## Future Enhancements

1. **Authentication:** Add user accounts and API keys
2. **Webhooks:** Notify on events (new message, error)
3. **Batch Endpoints:** Process multiple queries
4. **GraphQL:** Alternative to REST
5. **WebSockets:** Real-time bidirectional communication
6. **Caching Layer:** Redis for distributed caching
7. **Analytics:** Track usage patterns
8. **A/B Testing:** Test different prompts/models
9. **Feedback Loop:** Collect user ratings
10. **Admin Dashboard:** Monitor and manage API
