# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Chat Page    │  │ Browse Page  │  │ Layout       │      │
│  │ (/)          │  │ (/browse)    │  │ Components   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘      │
│         │                  │                                 │
│         └──────────┬───────┘                                 │
│                    │                                         │
│         ┌──────────▼──────────┐                             │
│         │   Zustand Store     │                             │
│         │  (UI State, Theme)  │                             │
│         └─────────────────────┘                             │
└─────────────────────────────────────────────────────────────┘
                       │
                       │ HTTP/Streaming
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Routes (Next.js)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /api/chat (POST)                                    │   │
│  │  - Rate limiting                                     │   │
│  │  - Streaming response                                │   │
│  │  - Error handling                                    │   │
│  └────────────────────┬─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    RAG System (lib/ai/)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Retrieval   │→ │  Prompts     │→ │  OpenAI      │      │
│  │  (Vector     │  │  (System +   │  │  (GPT-4o-    │      │
│  │   Search)    │  │   User)      │  │   mini)      │      │
│  └──────┬───────┘  └──────────────┘  └──────┬───────┘      │
│         │                                     │              │
│         │                                     │              │
└─────────┼─────────────────────────────────────┼──────────────┘
          │                                     │
          ▼                                     ▼
┌──────────────────┐                  ┌──────────────────┐
│   Supabase       │                  │   OpenAI API     │
│   (PostgreSQL    │                  │   - Chat         │
│    + pgvector)   │                  │   - Embeddings   │
│                  │                  │                  │
│  - Embeddings    │                  └──────────────────┘
│  - Metadata      │
│  - Vector Search │
└──────────────────┘
```

## Data Flow

### 1. Chat Query Flow

```
User Input
    │
    ▼
ChatInterface Component
    │
    ├─ Validate input
    ├─ Set loading state
    └─ POST to /api/chat
         │
         ▼
    API Route Handler
         │
         ├─ Check rate limit
         ├─ Extract query & context
         └─ Call streamRAGResponse()
              │
              ▼
         RAG System
              │
              ├─ retrieveRelevantContent()
              │    │
              │    ├─ Generate query embedding
              │    ├─ Vector search in Supabase
              │    └─ Return top 15 chunks (min 0.4 score)
              │
              ├─ buildMessages()
              │    │
              │    ├─ System prompt (personality, guidelines)
              │    └─ User prompt (context + query)
              │
              └─ OpenAI Streaming
                   │
                   ├─ Stream chunks to client
                   ├─ Extract citations
                   └─ Send completion marker
                        │
                        ▼
                   Client Receives Stream
                        │
                        ├─ Accumulate content
                        ├─ Display with typing cursor
                        └─ Render citations
```

### 2. Browse Mode Flow

```
User Navigates to /browse
    │
    ▼
PortfolioLayout Component
    │
    ├─ Render Sidebar (section tabs)
    ├─ Render Header (quick links)
    └─ Render Main Content
         │
         ├─ SectionTabs (Projects/Experience/Education)
         │
         └─ Active Section Component
              │
              ├─ ProjectGrid (if Projects)
              │    │
              │    ├─ FilterBar (category, sort, group)
              │    └─ ProjectCard[] (grid layout)
              │
              ├─ ExperienceSection (if Experience)
              │    └─ ExperienceCard[]
              │
              └─ EducationSection (if Education)
                   └─ EducationCard[]
                        │
                        ▼
                   User Clicks Card
                        │
                        ▼
                   setSelectedItem() in Zustand
                        │
                        ▼
                   DetailsPanel Opens
                        │
                        ├─ Display full details
                        ├─ Show metrics/highlights
                        └─ CTAs (Ask About, Book Call)
```

### 3. Context-Aware Chat Flow

```
User Views Project in Browse Mode
    │
    ▼
Clicks "Ask about this project"
    │
    ├─ setChatContext({ enabled: true, itemId, itemType })
    ├─ Navigate to /
    └─ Close details panel
         │
         ▼
ChatInterface Loads
    │
    ├─ Display context pill (badge with project name)
    ├─ Show context-specific prompt suggestions
    └─ User asks question
         │
         ▼
    API receives context in request body
         │
         ▼
    RAG retrieval filters by itemId
         │
         ├─ Boost chunks from specific item
         └─ Prioritize relevant content
              │
              ▼
         AI response scoped to context
```

## Component Hierarchy

### Chat Page (/)

```
page.tsx
└─ PortfolioLayout
    ├─ Sidebar (collapsible)
    ├─ Header (quick links, theme toggle)
    ├─ Main Content
    │   └─ ChatInterface
    │       ├─ Context Indicator (if enabled)
    │       ├─ Chat Area
    │       │   ├─ Empty State (hero + suggestions)
    │       │   │   ├─ TypingAnimation (name)
    │       │   │   ├─ TypingAnimation (tagline)
    │       │   │   └─ PromptSuggestions
    │       │   │
    │       │   └─ Messages
    │       │       ├─ Message (user)
    │       │       ├─ TerminalLoading (if loading)
    │       │       ├─ Message (assistant)
    │       │       │   ├─ ReactMarkdown (content)
    │       │       │   ├─ Citations (badges)
    │       │       │   └─ CalendlyCTA (if triggered)
    │       │       └─ Error Alert (if error)
    │       │
    │       └─ Input Area
    │           └─ TerminalInput
    │
    └─ DetailsPanel (slide-in from right)
```

### Browse Page (/browse)

```
page.tsx
└─ PortfolioLayout (showCatalog=true)
    ├─ Sidebar (with active section highlight)
    ├─ Header
    ├─ Main Content
    │   ├─ SectionTabs
    │   └─ Active Section
    │       ├─ FilterBar (Projects only)
    │       └─ Grid/List
    │           └─ Cards[]
    │               └─ onClick → setSelectedItem()
    │
    └─ DetailsPanel
        ├─ Header (category, year, close button)
        ├─ Content (scrollable)
        │   ├─ Title & Summary
        │   ├─ Metrics Grid
        │   ├─ Problem/Approach/Impact
        │   ├─ Technologies (badges)
        │   └─ Links (GitHub, Live, Case Study)
        │
        └─ Footer Actions
            ├─ "Ask about this" → setChatContext + navigate
            └─ "Book a call" → Calendly
```

## State Management (Zustand)

### UI Store Structure

```typescript
interface UIState {
  // Sidebar
  isSidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  
  // Details Panel
  isDetailsPanelOpen: boolean
  selectedItemId: string | null
  selectedItemType: 'project' | 'experience' | 'education' | null
  setSelectedItem: (id, type) => void
  closeDetailsPanel: () => void
  
  // Chat Context
  chatContext: {
    enabled: boolean
    itemId: string | null
    itemType: 'project' | 'experience' | 'education' | null
  }
  setChatContext: (context) => void
  clearChatContext: () => void
  
  // New Chat Trigger
  newChatTrigger: number
  triggerNewChat: () => void
  
  // View Preferences
  viewMode: 'grid' | 'list'
  setViewMode: (mode) => void
  
  // Theme
  theme: 'light' | 'dark'
  accentColor: 'teal' | 'blue' | 'pink' | ...
  setTheme: (theme) => void
  toggleTheme: () => void
  setAccentColor: (color) => void
  
  // Animation State
  isInitialAnimationComplete: boolean
  setInitialAnimationComplete: (complete) => void
}
```

### Persisted State

Stored in localStorage as `portfolio-ui-preferences`:
- `theme` (light/dark)
- `viewMode` (grid/list)
- `accentColor` (teal/blue/pink/etc.)

Other state is session-only (resets on page reload).

## API Routes

### POST /api/chat

**Request:**
```typescript
{
  query: string
  context?: {
    enabled: boolean
    itemType: 'project' | 'experience' | 'education'
    itemId: string
  }
  stream?: boolean // default true
}
```

**Response (Streaming):**
```
# Line 1: Metadata
{"type":"metadata","citations":[...]}

# Lines 2-N: Content chunks
{"type":"chunk","content":"Hello "}
{"type":"chunk","content":"world"}

# Last line: Completion
{"type":"done"}
```

**Response (Non-streaming):**
```typescript
{
  answer: string
  citations: Citation[]
  confidence: number
}
```

**Rate Limiting:**
- 20 requests per window
- IP-based identification
- Returns 429 with retry-after header

## Database Schema (Supabase)

### Table: portfolio_embeddings

```sql
CREATE TABLE portfolio_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding VECTOR(1536) NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vector similarity index
CREATE INDEX portfolio_embeddings_embedding_idx 
ON portfolio_embeddings 
USING ivfflat (embedding vector_cosine_ops);
```

**Metadata Structure:**
```typescript
{
  type: 'project' | 'experience' | 'education' | 'bio' | 'faq' | ...
  itemId: string
  title: string
  category?: string
  year?: number
  tags?: string[]
}
```

## External Services

### OpenAI API
- **Chat Completions:** GPT-4o-mini (streaming)
- **Embeddings:** text-embedding-3-small (1536 dimensions)
- **Rate Limits:** Tier-based (check OpenAI dashboard)

### Supabase
- **Database:** PostgreSQL 15+
- **Vector Extension:** pgvector
- **Auth:** Service role key (server-side only)
- **Storage:** Not currently used

### Calendly
- **Integration:** Direct links (no API)
- **URL:** https://calendly.com/shreetbohara/connect-with-shree

## Security Considerations

1. **API Keys:** Server-side only (never exposed to client)
2. **Rate Limiting:** IP-based, 20 requests per window
3. **Input Validation:** Query length, type checking
4. **CORS:** Next.js default (same-origin)
5. **SQL Injection:** Parameterized queries via Supabase client
6. **XSS:** React auto-escapes, ReactMarkdown sanitizes

## Performance Optimizations

1. **Streaming Responses:** Reduces perceived latency
2. **Minimum Loading Time:** 2s to prevent flickering
3. **Code Splitting:** Next.js automatic
4. **Image Optimization:** Next.js Image component (not yet used)
5. **CSS-in-JS:** Tailwind (build-time)
6. **Lazy Loading:** Framer Motion AnimatePresence
7. **Memoization:** React.memo on expensive components (not yet implemented)

## Deployment Architecture

### Vercel (Recommended)

```
GitHub Repository
    │
    ├─ Push to main branch
    │
    ▼
Vercel Build
    │
    ├─ Install dependencies
    ├─ Build Next.js app
    ├─ Optimize assets
    └─ Deploy to Edge Network
         │
         ▼
    Production URL
         │
         ├─ Static assets (CDN)
         ├─ API routes (serverless functions)
         └─ SSR pages (on-demand)
```

**Environment Variables (Vercel):**
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Error Handling

### Client-Side
- Try-catch in async functions
- Error state in components
- User-friendly error messages
- Retry buttons for failed requests

### Server-Side
- Try-catch in API routes
- Fallback to placeholder responses
- Detailed logging (console.error)
- Proper HTTP status codes (400, 429, 500)

### AI/RAG
- Fallback to placeholder if vector store unavailable
- Graceful degradation if embeddings fail
- Retry logic for OpenAI API errors
- Timeout handling for long requests

## Monitoring & Observability

**Current State:** Minimal (console.log)

**Recommended Additions:**
- Sentry for error tracking
- Vercel Analytics for performance
- Custom logging service (LogRocket, Datadog)
- OpenAI usage tracking
- Supabase query performance monitoring
