# Quick Reference: RAG Pipeline Commands

## Check Indexed Data

### 1. Check Index Status
```bash
curl http://localhost:3000/api/admin/reindex
```

**Response:**
```json
{
  "available": true,
  "count": 45,
  "message": "Content is indexed"
}
```

### 2. View All Indexed Embeddings
```bash
# View first 20 embeddings
curl http://localhost:3000/api/admin/embeddings

# View only projects
curl "http://localhost:3000/api/admin/embeddings?type=project"

# View specific item
curl "http://localhost:3000/api/admin/embeddings?itemId=proj-1"

# View with custom limit
curl "http://localhost:3000/api/admin/embeddings?limit=50"
```

**Response:**
```json
{
  "total": 45,
  "countsByType": {
    "project": 20,
    "experience": 15,
    "education": 10
  },
  "results": [
    {
      "id": "project-proj-1-summary",
      "contentPreview": "Project: GlobePulse - AI-Powered Global News Visualization Platform...",
      "contentLength": 245,
      "metadata": {
        "type": "project",
        "itemId": "proj-1",
        "title": "GlobePulse",
        "year": 2025,
        "category": "AI/ML"
      },
      "createdAt": "2024-11-10T14:30:00Z"
    }
  ],
  "filters": {
    "type": null,
    "itemId": null,
    "limit": 20
  }
}
```

## Update Data

### Step 1: Edit Portfolio Data
Edit `src/data/portfolio.ts`:
- Update `projects` array
- Update `experiences` array  
- Update `education` array

### Step 2: Re-index
```bash
# Force re-index (deletes old, creates new)
curl -X POST http://localhost:3000/api/admin/reindex \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

### Step 3: Verify
```bash
# Check new count
curl http://localhost:3000/api/admin/reindex

# View updated embeddings
curl "http://localhost:3000/api/admin/embeddings?itemId=proj-1"
```

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ USER ENTERS QUERY                                            │
│ "What are your top AI projects?"                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND: ChatInterface.tsx                                 │
│ - handleSubmit()                                            │
│ - Sends POST /api/chat                                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ API: /api/chat/route.ts                                     │
│ - Rate limiting check (20/min)                              │
│ - Extract query + context                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ RAG: rag.ts                                                 │
│ streamRAGResponse()                                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ RETRIEVAL: retrieval.ts                                     │
│ retrieveRelevantContent()                                   │
│                                                              │
│ Step 1: Generate Query Embedding                             │
│   └─→ embeddings.ts: generateEmbedding()                    │
│       - Check cache (24h TTL)                               │
│       - If miss: OpenAI Embeddings API                      │
│                                                              │
│ Step 2: Vector Search                                        │
│   └─→ vector-store.ts: searchSimilar()                     │
│       - Supabase RPC: match_portfolio_embeddings()          │
│       - Returns top 7 chunks with similarity scores          │
│                                                              │
│ Step 3: Extract Citations                                    │
│   └─→ extractCitations()                                    │
│       - Groups by itemId                                    │
│       - Creates Citation objects                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ PROMPTS: prompts.ts                                         │
│ buildMessages()                                             │
│ - System prompt: AI assistant role                          │
│ - User prompt: Retrieved context + user query               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ OPENAI API                                                  │
│ - Model: gpt-4o-mini                                        │
│ - Stream: true                                               │
│ - Generates response token by token                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ STREAM BACK TO CLIENT                                       │
│ - Metadata with citations sent first                         │
│ - Content chunks streamed in real-time                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND: ChatInterface.tsx                                 │
│ - Accumulates chunks                                        │
│ - Updates UI in real-time                                    │
│ - Displays citations as badges                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Indexing Flow

```
┌─────────────────────────────────────────────────────────────┐
│ SOURCE DATA                                                 │
│ src/data/portfolio.ts                                       │
│ - projects[]                                                │
│ - experiences[]                                             │
│ - education[]                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ CHUNKING: chunking.ts                                       │
│ chunkAllContent()                                           │
│                                                              │
│ Projects: 4 chunks each                                     │
│   - summary, details, metrics, tech                         │
│                                                              │
│ Experiences: N+2 chunks each                                │
│   - summary, highlights (N), technologies                   │
│                                                              │
│ Education: 2-4 chunks each                                  │
│   - degree, coursework, achievements, projects              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ EMBEDDINGS: embeddings.ts                                   │
│ generateChunkEmbeddings()                                   │
│ - Batch processing (100 at a time)                          │
│ - OpenAI Embeddings API                                     │
│ - 1536 dimensions per embedding                            │
│ - Cached for 24 hours                                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ VECTOR STORE: vector-store.ts                              │
│ upsertEmbeddings()                                          │
│ - Supabase: portfolio_embeddings table                       │
│ - Each row: id, content, embedding, metadata                │
└─────────────────────────────────────────────────────────────┘
```

## Common Tasks

### View What's Indexed
```bash
# Summary
curl http://localhost:3000/api/admin/reindex

# Detailed view
curl http://localhost:3000/api/admin/embeddings
```

### Update Content
1. Edit `src/data/portfolio.ts`
2. Re-index: `curl -X POST http://localhost:3000/api/admin/reindex -H "Content-Type: application/json" -d '{"force": true}'`
3. Verify: `curl http://localhost:3000/api/admin/reindex`

### Check Specific Project
```bash
# View all chunks for a project
curl "http://localhost:3000/api/admin/embeddings?itemId=proj-1"
```

### View by Type
```bash
# Projects only
curl "http://localhost:3000/api/admin/embeddings?type=project"

# Experiences only
curl "http://localhost:3000/api/admin/embeddings?type=experience"

# Education only
curl "http://localhost:3000/api/admin/embeddings?type=education"
```

## File Locations

```
Data Source:
  src/data/portfolio.ts                    ← Edit here to update content

Chunking:
  src/lib/ai/chunking.ts                   ← How data is split

Embeddings:
  src/lib/ai/embeddings.ts                 ← Generates vectors

Vector Store:
  src/lib/ai/vector-store.ts               ← Supabase operations

Retrieval:
  src/lib/ai/retrieval.ts                  ← Semantic search

Prompts:
  src/lib/ai/prompts.ts                    ← Prompt building

RAG:
  src/lib/ai/rag.ts                        ← Main orchestrator

API:
  src/app/api/chat/route.ts                ← Chat endpoint
  src/app/api/admin/reindex/route.ts       ← Re-index endpoint
  src/app/api/admin/embeddings/route.ts    ← View embeddings endpoint

Frontend:
  src/components/chat/ChatInterface.tsx     ← Chat UI

Database:
  supabase/migrations/001_create_portfolio_embeddings.sql
```

