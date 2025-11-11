import { NextRequest, NextResponse } from 'next/server';
import { chunkAllContent } from '@/lib/ai/chunking';
import { generateChunkEmbeddings } from '@/lib/ai/embeddings';
import { upsertEmbeddings, deleteAllEmbeddings, getEmbeddingCount, isVectorStoreAvailable } from '@/lib/ai/vector-store';
import { projects, experiences, education, personalInfo } from '@/data/portfolio';

/**
 * Protected API route to re-index all portfolio content
 * Add authentication/authorization as needed
 */
export async function POST(request: NextRequest) {
  try {
    // Check if vector store is available
    if (!isVectorStoreAvailable()) {
      return NextResponse.json(
        { error: 'Vector store is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 500 }
      );
    }

    // TODO: Add authentication check here
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { force } = await request.json().catch(() => ({}));

    // Get current count
    const currentCount = await getEmbeddingCount();

    // Delete existing embeddings if force is true or count is 0
    if (force || currentCount === 0) {
      if (currentCount > 0) {
        await deleteAllEmbeddings();
      }

      // Chunk all content (including personalInfo/skills)
      const chunks = chunkAllContent(projects, experiences, education, personalInfo);

      // Generate embeddings
      const chunksWithEmbeddings = await generateChunkEmbeddings(chunks);

      // Upsert to vector database
      await upsertEmbeddings(chunksWithEmbeddings);

      const newCount = await getEmbeddingCount();

      return NextResponse.json({
        success: true,
        message: 'Content re-indexed successfully',
        chunksIndexed: chunks.length,
        embeddingsCreated: newCount,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Embeddings already exist. Set force=true to re-index.',
        currentCount,
      });
    }
  } catch (error) {
    console.error('Re-indexing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to re-index content' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check indexing status
 */
export async function GET() {
  try {
    if (!isVectorStoreAvailable()) {
      return NextResponse.json({
        available: false,
        count: 0,
        message: 'Vector store is not configured',
      });
    }

    const count = await getEmbeddingCount();

    return NextResponse.json({
      available: true,
      count,
      message: count > 0 ? 'Content is indexed' : 'No content indexed yet',
    });
  } catch (error) {
    console.error('Error checking index status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check index status' },
      { status: 500 }
    );
  }
}

