import { NextRequest, NextResponse } from 'next/server';
import { isVectorStoreAvailable, getEmbeddingCount } from '@/lib/ai/vector-store';
import { createClient } from '@supabase/supabase-js';

/**
 * GET endpoint to view indexed embeddings
 * Query params:
 * - type: Filter by type (project, experience, education)
 * - itemId: Filter by specific item ID
 * - limit: Limit results (default: 20)
 */
export async function GET(request: NextRequest) {
  try {
    if (!isVectorStoreAvailable()) {
      return NextResponse.json(
        { error: 'Vector store is not configured' },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const itemId = searchParams.get('itemId');
    const limit = parseInt(searchParams.get('limit') || '20');

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Build query
    let query = supabase
      .from('portfolio_embeddings')
      .select('id, content, metadata, created_at')
      .limit(limit)
      .order('created_at', { ascending: false });

    // Apply filters
    if (type) {
      query = query.eq('metadata->>type', type);
    }
    if (itemId) {
      query = query.eq('metadata->>itemId', itemId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching embeddings:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Get total count
    const totalCount = await getEmbeddingCount();

    // Get counts by type
    const { data: allItems } = await supabase
      .from('portfolio_embeddings')
      .select('metadata');

    const countsByType: Record<string, number> = {};
    allItems?.forEach((item: any) => {
      const type = item.metadata?.type || 'unknown';
      countsByType[type] = (countsByType[type] || 0) + 1;
    });

    return NextResponse.json({
      total: totalCount,
      countsByType,
      results: data?.map((item) => ({
        id: item.id,
        contentPreview: item.content.substring(0, 150) + (item.content.length > 150 ? '...' : ''),
        contentLength: item.content.length,
        metadata: item.metadata,
        createdAt: item.created_at,
      })) || [],
      filters: {
        type: type || null,
        itemId: itemId || null,
        limit,
      },
    });
  } catch (error) {
    console.error('Error in embeddings API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

