/**
 * Script to index all portfolio content into the vector database
 * Run with: npx tsx scripts/index-content.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

import { chunkAllContent } from '../src/lib/ai/chunking';
import { generateChunkEmbeddings } from '../src/lib/ai/embeddings';
import { upsertEmbeddings, deleteAllEmbeddings, getEmbeddingCount } from '../src/lib/ai/vector-store';
import { projects, experiences, education, personalInfo } from '../src/data/portfolio';

async function indexContent() {
  console.log('🚀 Starting content indexing...\n');

  try {
    // Check if vector store is available
    const { isVectorStoreAvailable } = await import('../src/lib/ai/vector-store');
    if (!isVectorStoreAvailable()) {
      console.error('❌ Vector store is not available. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
      process.exit(1);
    }

    // Get current count
    const currentCount = await getEmbeddingCount();
    console.log(`📊 Current embeddings in database: ${currentCount}\n`);

    // Ask for confirmation if there are existing embeddings
    if (currentCount > 0) {
      console.log('⚠️  Existing embeddings found. This will delete all existing embeddings and re-index.');
      console.log('   To proceed, set FORCE_REINDEX=true environment variable.\n');
      
      if (process.env.FORCE_REINDEX !== 'true') {
        console.log('❌ Aborted. Set FORCE_REINDEX=true to proceed with re-indexing.');
        process.exit(0);
      }
    }

    // Delete existing embeddings if re-indexing
    if (currentCount > 0) {
      console.log('🗑️  Deleting existing embeddings...');
      await deleteAllEmbeddings();
      console.log('✅ Deleted existing embeddings\n');
    }

    // Chunk all content (including personalInfo/skills)
    console.log('📝 Chunking content...');
    const chunks = chunkAllContent(projects, experiences, education, personalInfo);
    console.log(`✅ Created ${chunks.length} chunks\n`);

    // Generate embeddings
    console.log('🔮 Generating embeddings (this may take a while)...');
    const chunksWithEmbeddings = await generateChunkEmbeddings(chunks);
    console.log(`✅ Generated ${chunksWithEmbeddings.length} embeddings\n`);

    // Upsert to vector database
    console.log('💾 Storing embeddings in vector database...');
    await upsertEmbeddings(chunksWithEmbeddings);
    console.log('✅ Stored all embeddings\n');

    // Verify count
    const newCount = await getEmbeddingCount();
    console.log(`📊 New embeddings count: ${newCount}`);
    console.log('✅ Indexing complete!\n');
  } catch (error) {
    console.error('❌ Error during indexing:', error);
    process.exit(1);
  }
}

// Run the script
indexContent();

