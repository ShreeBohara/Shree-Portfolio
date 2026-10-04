/**
 * Script to index all portfolio content into the vector database
 * Run with: npx tsx scripts/index-content.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

import { chunkAllContent } from '../src/lib/ai/chunking';
import { generateChunkEmbeddings } from '../src/lib/ai/embeddings';
import { upsertEmbeddings, pruneEmbeddings, getEmbeddingCount } from '../src/lib/ai/vector-store';
import { projects, experiences, education, personalInfo } from '../src/data/portfolio';
import { AI_CONFIG } from '../src/lib/ai/config';

async function indexContent() {
  console.log('🚀 Starting content indexing...\n');

  try {
    // Check if vector store is available
    const { isVectorStoreAvailable } = await import('../src/lib/ai/vector-store');
    if (!isVectorStoreAvailable()) {
      console.error('❌ Vector store is not available. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
      process.exitCode = 1;
      return;
    }

    // Get current count
    const currentCount = await getEmbeddingCount();
    console.log(`📊 Current embeddings in database: ${currentCount}\n`);

    // Ask for confirmation if there are existing embeddings
    if (currentCount > 0) {
      console.log('⚠️  Existing embeddings found. This will refresh the index and remove obsolete entries after the new content is stored.');
      console.log('   To proceed, set FORCE_REINDEX=true environment variable.\n');
      
      if (process.env.FORCE_REINDEX !== 'true') {
        console.log('❌ Aborted. Set FORCE_REINDEX=true to proceed with re-indexing.');
        return;
      }
    }

    // Chunk all content (including personalInfo/skills)
    console.log('📝 Chunking content...');
    const chunks = chunkAllContent(projects, experiences, education, personalInfo);
    if (chunks.length === 0) throw new Error('Refusing to replace the index with empty content');
    const expectedIds = new Set(chunks.map((chunk) => chunk.id));
    if (expectedIds.size !== chunks.length) throw new Error('Content contains duplicate chunk IDs');
    console.log(`✅ Created ${chunks.length} chunks\n`);

    // Generate embeddings
    console.log('🔮 Generating embeddings (this may take a while)...');
    const chunksWithEmbeddings = await generateChunkEmbeddings(chunks);
    const generatedIds = new Set(chunksWithEmbeddings.map((chunk) => chunk.id));
    if (chunksWithEmbeddings.length !== chunks.length || generatedIds.size !== expectedIds.size ||
      chunksWithEmbeddings.some((chunk) => !expectedIds.has(chunk.id) ||
        !Array.isArray(chunk.embedding) || chunk.embedding.length !== AI_CONFIG.embedding.dimensions ||
        !chunk.embedding.every(Number.isFinite))) {
      throw new Error('Generated embeddings are incomplete or invalid; preserving the existing index');
    }
    console.log(`✅ Generated ${chunksWithEmbeddings.length} embeddings\n`);

    // Upsert to vector database
    console.log('💾 Storing embeddings in vector database...');
    await upsertEmbeddings(chunksWithEmbeddings);
    console.log('✅ Stored all embeddings\n');

    // Only retire obsolete rows after generation and every upsert has succeeded.
    // An embedding/provider/write failure leaves the existing index in place.
    await pruneEmbeddings(chunksWithEmbeddings.map((chunk) => chunk.id));

    // Verify count
    const newCount = await getEmbeddingCount();
    if (newCount !== expectedIds.size) {
      throw new Error(`Index count mismatch: expected ${expectedIds.size}, found ${newCount}`);
    }
    console.log(`📊 New embeddings count: ${newCount}`);
    console.log('✅ Indexing complete!\n');
  } catch (error) {
    console.error('❌ Error during indexing:', error);
    process.exitCode = 1;
  }
}

// Run the script
indexContent();
