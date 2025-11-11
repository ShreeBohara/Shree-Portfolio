import { NextRequest } from 'next/server';
import { streamRAGResponse, getRAGResponse } from '@/lib/ai/rag';
import { extractCitations } from '@/lib/ai/retrieval';
import { retrieveRelevantContent } from '@/lib/ai/retrieval';
import { checkRateLimit, getRemainingRequests, getResetTime } from '@/lib/ai/rate-limit';

export const runtime = 'nodejs'; // Changed from 'edge' to 'nodejs' for Supabase compatibility

function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  return ip;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    if (!checkRateLimit(clientId)) {
      const remaining = getRemainingRequests(clientId);
      const resetTime = getResetTime(clientId);
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `Too many requests. Please try again after ${new Date(resetTime).toISOString()}`,
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': resetTime.toString(),
          },
        }
      );
    }

    const { query, context, stream: shouldStream = true } = await request.json();

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // If streaming is requested
    if (shouldStream) {
      // Retrieve citations first (needed for final response)
      const retrievedChunks = await retrieveRelevantContent(query, {
        limit: 7,
        filter: context?.enabled && context?.itemId
          ? {
              type: context.itemType,
              itemId: context.itemId,
            }
          : undefined,
        boostItemId: context?.enabled ? context.itemId : undefined,
      });
      const citations = extractCitations(retrievedChunks);

      // Create a readable stream
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Send initial metadata with citations
            const metadata = JSON.stringify({ type: 'metadata', citations }) + '\n';
            controller.enqueue(encoder.encode(metadata));

            // Stream the response
            for await (const chunk of streamRAGResponse(query, context)) {
              const data = JSON.stringify({ type: 'chunk', content: chunk }) + '\n';
              controller.enqueue(encoder.encode(data));
            }

            // Send completion marker
            const done = JSON.stringify({ type: 'done' }) + '\n';
            controller.enqueue(encoder.encode(done));
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            const errorData = JSON.stringify({
              type: 'error',
              error: error instanceof Error ? error.message : 'Streaming failed',
            }) + '\n';
            controller.enqueue(encoder.encode(errorData));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Non-streaming response
      const response = await getRAGResponse(query, context);
      return new Response(
        JSON.stringify(response),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
