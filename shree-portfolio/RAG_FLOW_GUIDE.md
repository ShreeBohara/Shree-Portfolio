# RAG Pipeline Flow Guide

## Complete Flow: From User Query to Response

### 1. User Enters Chat Query
**Location**: `src/components/chat/ChatInterface.tsx`

```
User types: "What are your top AI projects?"
    ↓
handleSubmit() is triggered
    ↓
Query is sent to: POST /api/chat
```

### 2. Chat API Route (`/api/chat`)
**Location**: `src/app/api/chat/route.ts`

```
POST /api/chat
    ↓
Rate Limiting Check (20 requests/minute per IP)
    ↓
Extract query and context (if viewing specific project/experience)
    ↓
Call RAG Orchestrator
```

### 3. RAG Orchestrator
**Location**: `src/lib/ai/rag.ts`

```
getRAGResponse() or streamRAGResponse()
    ↓
┌─────────────────────────────────────┐
│  Step 1: Retrieve Relevant Content │
└─────────────────────────────────────┘
    ↓
retrieveRelevantContent(query, context)
    ↓
    ├─→ Generate Query Embedding
    │   Location: src/lib/ai/embeddings.ts
    │   - Check cache first (24h TTL)
    │   - If not cached: Call OpenAI Embeddings API
    │   - Cache the result
    │
    └─→ Vector Search
        Location: src/lib/ai/vector-store.ts
        - Call Supabase RPC: match_portfolio_embeddings()
        - Returns top 7 similar chunks with similarity scores
        - Filters by context if viewing specific item
    ↓
┌─────────────────────────────────────┐
│  Step 2: Extract Citations          │
└─────────────────────────────────────┘
    ↓
extractCitations(retrievedChunks)
    - Groups chunks by itemId
    - Creates Citation objects with type, id, title
    ↓
┌─────────────────────────────────────┐
│  Step 3: Build Prompt              │
└─────────────────────────────────────┘
    ↓
buildMessages(query, retrievedChunks, context)
    Location: src/lib/ai/prompts.ts
    - System prompt: Defines AI assistant role
    - User prompt: Includes retrieved context + user query
    ↓
┌─────────────────────────────────────┐
│  Step 4: Generate Response          │
└─────────────────────────────────────┘
    ↓
OpenAI Chat Completion API
    - Model: gpt-4o-mini
    - Stream: true (for real-time response)
    - Temperature: 0.7
    ↓
┌─────────────────────────────────────┐
│  Step 5: Stream Response            │
└─────────────────────────────────────┘
    ↓
Stream chunks back to client
    - Each chunk contains text content
    - Citations sent in initial metadata
    ↓
Frontend receives stream
    Location: src/components/chat/ChatInterface.tsx
    - Accumulates chunks
    - Updates UI in real-time
    - Displays citations as badges
```

## Data Indexing Flow

### Initial Indexing Process

```
Portfolio Data (Static Files)
    ↓
Location: src/data/portfolio.ts
    - projects[]
    - experiences[]
    - education[]
    ↓
Chunking Process
    Location: src/lib/ai/chunking.ts
    ↓
    ├─→ chunkProject() - Creates 4 chunks per project:
    │   - Summary chunk (title + summary)
    │   - Details chunk (problem + approach + impact)
    │   - Metrics chunk (if metrics exist)
    │   - Tech chunk (technologies + role)
    │
    ├─→ chunkExperience() - Creates chunks per experience:
    │   - Summary chunk (role + summary)
    │   - Highlight chunks (one per achievement)
    │   - Technologies chunk
    │
    └─→ chunkEducation() - Creates chunks per education:
        - Degree chunk
        - Coursework chunk
        - Achievements chunk
        - Projects chunk (if exists)
    ↓
Generate Embeddings
    Location: src/lib/ai/embeddings.ts
    - Batch processing (100 chunks at a time)
    - OpenAI Embeddings API (text-embedding-3-small)
    - 1536 dimensions per embedding
    ↓
Store in Vector Database
    Location: src/lib/ai/vector-store.ts
    - Supabase: portfolio_embeddings table
    - Each row: id, content, embedding (vector), metadata (JSONB)
```

## How to Check Indexed Data

### Method 1: Check via API (Recommended)

```bash
# Check index status and count
curl http://localhost:3000/api/admin/reindex

# Response:
# {
#   "available": true,
#   "count": 45,
#   "message": "Content is indexed"
# }
```

### Method 2: Check via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor**
3. Open the `portfolio_embeddings` table
4. You'll see:
   - **id**: Unique chunk identifier (e.g., `project-proj-1-summary`)
   - **content**: The actual text content
   - **embedding**: Vector representation (1536 dimensions)
   - **metadata**: JSON with type, itemId, title, year, category, tags
   - **created_at**: When it was indexed

### Method 3: Query via SQL

```sql
-- Count total chunks
SELECT COUNT(*) FROM portfolio_embeddings;

-- Count by type
SELECT 
  metadata->>'type' as type,
  COUNT(*) as count
FROM portfolio_embeddings
GROUP BY metadata->>'type';

-- View sample chunks
SELECT 
  id,
  LEFT(content, 100) as content_preview,
  metadata->>'type' as type,
  metadata->>'title' as title
FROM portfolio_embeddings
LIMIT 10;

-- View all chunks for a specific project
SELECT 
  id,
  content,
  metadata
FROM portfolio_embeddings
WHERE metadata->>'itemId' = 'proj-1';
```

## How to Update Data When Content Changes

### Step 1: Update Portfolio Data

Edit the source files:
- **Projects**: `src/data/portfolio.ts` → `projects` array
- **Experiences**: `src/data/portfolio.ts` → `experiences` array
- **Education**: `src/data/portfolio.ts` → `education` array

### Step 2: Re-index Content

You have two options:

#### Option A: Force Re-index via API (Recommended)

```bash
# After making changes to portfolio.ts, restart dev server if needed
npm run dev

# In another terminal, force re-index
curl -X POST http://localhost:3000/api/admin/reindex \
  -H "Content-Type: application/json" \
  -d '{"force": true}'

# Response:
# {
#   "success": true,
#   "message": "Content re-indexed successfully",
#   "chunksIndexed": 45,
#   "embeddingsCreated": 45
# }
```

#### Option B: Re-index via Script

```bash
# Force re-index using the script
FORCE_REINDEX=true npx tsx scripts/index-content.ts
```

### Step 3: Verify Changes

```bash
# Check new count
curl http://localhost:3000/api/admin/reindex

# Test with a query that should include your new content
# Open browser: http://localhost:3000
# Ask: "Tell me about [your new project/experience]"
```

## Data Structure in Vector Database

### Table Schema: `portfolio_embeddings`

```sql
CREATE TABLE portfolio_embeddings (
  id TEXT PRIMARY KEY,                    -- e.g., "project-proj-1-summary"
  content TEXT NOT NULL,                  -- The actual text chunk
  embedding vector(1536) NOT NULL,        -- Vector representation
  metadata JSONB NOT NULL,                -- Structured metadata
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### Metadata Structure

```json
{
  "type": "project" | "experience" | "education",
  "itemId": "proj-1" | "exp-1" | "edu-1",
  "title": "Project Name" | "Role at Company" | "Degree Name",
  "year": 2024,
  "category": "AI/ML" | "Full-Stack" | etc. (for projects),
  "tags": ["React", "TypeScript", ...]
}
```

### Example Chunk IDs

- `project-proj-1-summary` - Project summary chunk
- `project-proj-1-details` - Project details chunk
- `project-proj-1-metrics` - Project metrics chunk
- `project-proj-1-tech` - Project tech stack chunk
- `experience-exp-1-summary` - Experience summary
- `experience-exp-1-highlight-0` - First highlight
- `education-edu-1-degree` - Education degree info

## Understanding the Search Process

### When User Asks: "What are your top AI projects?"

1. **Query Embedding**: 
   - "What are your top AI projects?" → [0.123, -0.456, ...] (1536 dimensions)

2. **Vector Similarity Search**:
   - Compare query embedding with all stored embeddings
   - Calculate cosine similarity scores
   - Filter: similarity > 0.6 (minScore)
   - Return top 7 matches

3. **Retrieved Chunks** (example):
   ```
   [
     {
       content: "Project: GlobePulse - AI-Powered Global News...",
       metadata: { type: "project", itemId: "proj-1", title: "GlobePulse", category: "AI/ML" },
       similarity: 0.89
     },
     {
       content: "Project: AI-Powered Resume Builder...",
       metadata: { type: "project", itemId: "proj-2", title: "AI-Powered Resume Builder", category: "AI/ML" },
       similarity: 0.85
     },
     ...
   ]
   ```

4. **Context Building**:
   - Format chunks with headers
   - Add to prompt: "Here is relevant information..."
   - Include user query

5. **LLM Response**:
   - LLM reads context
   - Generates answer citing the projects
   - Streams response token by token

## Troubleshooting

### No Results from Search?

1. **Check if data is indexed**:
   ```bash
   curl http://localhost:3000/api/admin/reindex
   ```

2. **Check Supabase table**:
   ```sql
   SELECT COUNT(*) FROM portfolio_embeddings;
   ```

3. **Re-index if needed**:
   ```bash
   curl -X POST http://localhost:3000/api/admin/reindex -H "Content-Type: application/json" -d '{"force": true}'
   ```

### Wrong Results?

1. **Check similarity threshold** in `src/lib/ai/config.ts`:
   ```typescript
   retrieval: {
     topK: 7,
     minScore: 0.6,  // Lower = more results, Higher = stricter
   }
   ```

2. **Check chunking quality** - Maybe content needs better structure

3. **Check metadata** - Ensure metadata is correctly set during chunking

### Slow Responses?

1. **Check embedding cache** - First query is slower (generates embedding)
2. **Check Supabase performance** - Vector search should be fast with index
3. **Check OpenAI API** - Streaming should start quickly

## File Locations Summary

```
Data Source:
  src/data/portfolio.ts              # Your portfolio data

Chunking:
  src/lib/ai/chunking.ts            # Breaks data into chunks

Embeddings:
  src/lib/ai/embeddings.ts           # Generates embeddings (with cache)

Vector Store:
  src/lib/ai/vector-store.ts         # Supabase operations

Retrieval:
  src/lib/ai/retrieval.ts           # Semantic search logic

Prompts:
  src/lib/ai/prompts.ts             # Prompt building

RAG Orchestrator:
  src/lib/ai/rag.ts                 # Main RAG pipeline

API:
  src/app/api/chat/route.ts         # Chat endpoint
  src/app/api/admin/reindex/route.ts # Re-index endpoint

Frontend:
  src/components/chat/ChatInterface.tsx # Chat UI

Database:
  supabase/migrations/001_create_portfolio_embeddings.sql # Schema
```

## Quick Reference Commands

```bash
# Check index status
curl http://localhost:3000/api/admin/reindex

# Force re-index
curl -X POST http://localhost:3000/api/admin/reindex \
  -H "Content-Type: application/json" \
  -d '{"force": true}'

# Start dev server
npm run dev

# Run indexing script
FORCE_REINDEX=true npx tsx scripts/index-content.ts
```

