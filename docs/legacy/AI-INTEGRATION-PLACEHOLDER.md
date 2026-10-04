# AI Integration Guide

This directory contains the placeholder implementation for the AI-powered chat functionality. The current implementation uses mock responses to demonstrate the intended behavior.

## Current State (Placeholder)

- **rag-placeholder.ts**: Contains mock responses based on common queries
- **config.ts**: Configuration settings for future AI integration
- **/api/chat/route.ts**: API endpoint that uses the placeholder

## Future Implementation Steps

### 1. Choose AI Provider
```bash
# Option A: OpenAI
npm install openai

# Option B: Anthropic Claude
npm install @anthropic-ai/sdk

# Option C: Vercel AI SDK (recommended)
npm install ai
```

### 2. Set Up Vector Database
```bash
# Option A: Pinecone
npm install @pinecone-database/pinecone

# Option B: Supabase Vector
npm install @supabase/supabase-js

# Option C: Local ChromaDB
npm install chromadb
```

### 3. Environment Variables
```env
# .env.local
OPENAI_API_KEY=your-api-key
PINECONE_API_KEY=your-api-key
PINECONE_ENVIRONMENT=your-environment
PINECONE_INDEX_NAME=portfolio-content
```

### 4. Generate Embeddings

Replace the placeholder functions in `rag-placeholder.ts`:

```typescript
// Example implementation
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const openai = new OpenAI();
const pinecone = new Pinecone();

export async function generateEmbeddings(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

export async function semanticSearch(query: string, limit = 5) {
  const queryEmbedding = await generateEmbeddings(query);
  const index = pinecone.index('portfolio-content');
  
  const results = await index.query({
    vector: queryEmbedding,
    topK: limit,
    includeMetadata: true,
  });
  
  return results;
}
```

### 5. Implement Streaming Responses

Update `/api/chat/route.ts` to use Vercel AI SDK:

```typescript
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { openai } from '@/lib/ai/client';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    stream: true,
    messages,
  });
  
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
```

### 6. Content Pipeline

1. **Chunk Portfolio Data**: Break down projects, experiences, and education into semantic chunks
2. **Generate Embeddings**: Create vector embeddings for each chunk
3. **Store in Vector DB**: Save embeddings with metadata
4. **Update Index**: Ensure search index is current

### 7. Advanced Features

- **Conversation Memory**: Store chat history for context
- **Smart Caching**: Cache common queries
- **Rate Limiting**: Prevent abuse
- **Analytics**: Track query patterns
- **Feedback Loop**: Learn from user interactions

## Testing the Integration

1. Start with a small subset of data
2. Test common queries
3. Verify citation accuracy
4. Check response latency
5. Monitor token usage

## Security Considerations

- Never expose API keys in client-side code
- Implement rate limiting
- Sanitize user inputs
- Use environment variables
- Set up CORS properly

## Performance Optimization

- Cache embeddings
- Use edge functions for low latency
- Implement request debouncing
- Optimize chunk sizes
- Use streaming for long responses
