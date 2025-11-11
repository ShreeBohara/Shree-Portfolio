# RAG Pipeline Setup Guide

This guide will help you set up the RAG (Retrieval-Augmented Generation) pipeline for the portfolio chat feature.

## Prerequisites

1. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Supabase Account**: Sign up at [Supabase](https://supabase.com) (free tier is sufficient)

## Step 1: Set Up Supabase

1. Create a new Supabase project
2. Go to SQL Editor in your Supabase dashboard
3. Run the migration script located at `supabase/migrations/001_create_portfolio_embeddings.sql`
   - This creates the `portfolio_embeddings` table and the `match_portfolio_embeddings` function
4. Get your Supabase URL and Service Role Key:
   - Go to Project Settings → API
   - Copy the `Project URL` (SUPABASE_URL)
   - Copy the `service_role` key (SUPABASE_SERVICE_ROLE_KEY) - **Keep this secret!**

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root of your project:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

## Step 3: Index Portfolio Content

You have two options to index your portfolio content:

### Option A: Using the API Route (Recommended)

```bash
# Check current index status
curl http://localhost:3000/api/admin/reindex

# Re-index all content (force re-index)
curl -X POST http://localhost:3000/api/admin/reindex \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

### Option B: Using the Script

```bash
# Install tsx if not already installed
npm install -g tsx

# Run the indexing script
FORCE_REINDEX=true npx tsx scripts/index-content.ts
```

## Step 4: Verify Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the chat interface:
   - Navigate to `http://localhost:3000`
   - Ask a question like "What are your top AI projects?"
   - The response should stream in real-time with citations

3. Check the index status:
   ```bash
   curl http://localhost:3000/api/admin/reindex
   ```

## Troubleshooting

### Vector Store Not Available

If you see "Vector store not available" messages:
- Check that your environment variables are set correctly
- Verify your Supabase credentials are correct
- Ensure the migration script has been run successfully

### No Results from Search

If queries return no results:
- Verify that content has been indexed (check index count)
- Try re-indexing: `curl -X POST http://localhost:3000/api/admin/reindex -H "Content-Type: application/json" -d '{"force": true}'`
- Check Supabase logs for any errors

### Rate Limiting

The API has rate limiting enabled (20 requests per minute per IP). If you hit the limit:
- Wait for the rate limit window to reset
- Check the `Retry-After` header in the response

### Embedding Generation Fails

If embedding generation fails:
- Verify your OpenAI API key is valid and has credits
- Check OpenAI API status
- Review error logs in the console

## Architecture Overview

```
User Query
    ↓
Chat API Route (with rate limiting)
    ↓
RAG Orchestrator
    ↓
┌─────────────────┬─────────────────┐
│                 │                 │
Query Embedding   Vector Search    Prompt Builder
(Cached)          (Supabase)        (Context + Query)
│                 │                 │
└─────────────────┴─────────────────┘
    ↓
OpenAI Chat Completion (Streaming)
    ↓
Stream Response to Client
    ↓
Display with Citations
```

## File Structure

```
src/lib/ai/
├── client.ts          # OpenAI client setup
├── config.ts          # AI configuration
├── chunking.ts        # Content chunking logic
├── embeddings.ts      # Embedding generation (with caching)
├── vector-store.ts    # Supabase vector operations
├── retrieval.ts       # RAG retrieval logic
├── prompts.ts         # Prompt building
├── rag.ts             # Main RAG orchestrator
├── cache.ts           # Caching layer
└── rate-limit.ts      # Rate limiting

src/app/api/
├── chat/
│   └── route.ts       # Streaming chat endpoint
└── admin/
    └── reindex/
        └── route.ts   # Re-indexing endpoint

scripts/
└── index-content.ts   # One-time indexing script

supabase/migrations/
└── 001_create_portfolio_embeddings.sql  # Database schema
```

## Cost Considerations

- **OpenAI Embeddings**: ~$0.0001 per 1K tokens (text-embedding-3-small)
- **OpenAI Chat**: ~$0.15 per 1M input tokens, $0.60 per 1M output tokens (gpt-4o-mini)
- **Supabase**: Free tier includes 500MB database storage (sufficient for portfolio)

**Tips for cost optimization**:
- Embeddings are cached (24-hour TTL) - same queries won't regenerate embeddings
- Use the smaller embedding model (text-embedding-3-small)
- Limit top K results to 7 chunks
- Consider using GPT-4o-mini instead of GPT-4 for lower costs

## Next Steps

1. ✅ Set up Supabase and run migrations
2. ✅ Configure environment variables
3. ✅ Index portfolio content
4. ✅ Test the chat interface
5. 🔄 Monitor usage and costs
6. 🔄 Fine-tune retrieval parameters if needed
7. 🔄 Add authentication to re-index endpoint (currently open)

## Support

If you encounter issues:
1. Check the browser console for client-side errors
2. Check server logs for API errors
3. Verify all environment variables are set
4. Ensure Supabase migration was successful
5. Test with a simple query first

