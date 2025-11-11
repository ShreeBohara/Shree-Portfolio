# Diagnostic Steps: Why Chat Isn't Working

## Step 1: Check if Data is Indexed

```bash
# Check index status
curl http://localhost:3000/api/admin/reindex
```

**Expected Response:**
```json
{
  "available": true,
  "count": 45,  // Should be > 0
  "message": "Content is indexed"
}
```

**If count is 0:** You need to index your data first!

## Step 2: Index Your Data

```bash
# Force re-index
curl -X POST http://localhost:3000/api/admin/reindex \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Content re-indexed successfully",
  "chunksIndexed": 45,
  "embeddingsCreated": 45
}
```

## Step 3: Check Server Logs

When you ask a question, check your terminal/console for:

```
[RAG Stream] Query: "can u tell me about shree current internship?"
[RAG Stream] Retrieved 7 chunks
[RAG Stream] Top chunk similarity: 0.856
```

**If you see:**
- `Retrieved 0 chunks` → Data not indexed OR query doesn't match
- `Vector store not available` → Supabase not configured
- `No chunks retrieved` → Similarity threshold too high or no matches

## Step 4: Test Query Matching

```bash
# View what's indexed
curl http://localhost:3000/api/admin/embeddings?limit=5

# Check for internship-related content
curl "http://localhost:3000/api/admin/embeddings?type=experience"
```

## Step 5: Verify Supabase Connection

1. Go to Supabase Dashboard
2. Check `portfolio_embeddings` table
3. Should have rows with:
   - `id`: e.g., "experience-exp-1-summary"
   - `content`: The actual text
   - `metadata`: JSON with type, itemId, title

## Common Issues & Fixes

### Issue 1: "Vector store not available"
**Fix:** Check `.env.local` has:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Issue 2: "No chunks retrieved"
**Possible causes:**
- Data not indexed → Run re-index
- Query doesn't match content → Try different query
- Similarity threshold too high → Lower `minScore` in config

### Issue 3: Generic responses
**Fix:** 
- ✅ Already fixed with stricter prompts
- Make sure data is indexed
- Check logs to see if chunks are retrieved

### Issue 4: Wrong information
**Fix:**
- Re-index after updating `portfolio.ts`
- Check similarity scores in logs
- Verify correct chunks are retrieved

## Testing Checklist

- [ ] Data is indexed (count > 0)
- [ ] Supabase connection works
- [ ] Server logs show chunks being retrieved
- [ ] Similarity scores are reasonable (> 0.6)
- [ ] Prompts are strict (won't use general knowledge)
- [ ] Citations are displayed

## Quick Test Queries

Try these to verify it's working:

1. **Specific project:**
   "Tell me about GlobePulse project"
   → Should cite GlobePulse project

2. **Current role:**
   "What is Shree's current internship?"
   → Should cite QuinStreet experience

3. **Skills:**
   "What technologies does Shree know?"
   → Should list from portfolio

4. **Education:**
   "Where did Shree go to school?"
   → Should cite USC education

If these don't work, check the logs to see what's happening!

