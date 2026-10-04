import { NextRequest } from 'next/server';
import { streamRAGResponse, getRAGResponse, prepareRAGContext } from '@/lib/ai/rag';
import { extractCitations } from '@/lib/ai/retrieval';
import { checkRateLimit, getRemainingRequests, getResetTime, getRateLimitMax } from '@/lib/ai/rate-limit';
import { checkDenyList } from '@/lib/ai/deny';
import type { ChatContext } from '@/lib/ai/rag';

export const runtime = 'nodejs'; // Changed from 'edge' to 'nodejs' for Supabase compatibility

function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  return ip;
}

function badRequest(error: string): Response {
  return new Response(JSON.stringify({ error }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    if (!(await checkRateLimit(clientId))) {
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
            'X-RateLimit-Limit': String(getRateLimitMax()),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': resetTime.toString(),
          },
        }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return badRequest('A valid JSON request body is required');
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return badRequest('The request body must be a JSON object');
    }
    const payload = body as Record<string, unknown>;
    if (typeof payload.query !== 'string' || !payload.query.trim()) {
      return badRequest('Query is required');
    }
    const query = payload.query.trim();
    const shouldStream = payload.stream === undefined ? true : payload.stream;
    if (typeof shouldStream !== 'boolean') return badRequest('Stream must be a boolean');

    let context: ChatContext | undefined;
    if (payload.context !== undefined && payload.context !== null) {
      if (typeof payload.context !== 'object' || Array.isArray(payload.context)) {
        return badRequest('Context must be an object');
      }
      const inputContext = payload.context as Record<string, unknown>;
      if (inputContext.enabled !== undefined && typeof inputContext.enabled !== 'boolean') {
        return badRequest('Context enabled must be a boolean');
      }
      if (inputContext.enabled) {
        if (typeof inputContext.itemType !== 'string' ||
          !['project', 'experience', 'education'].includes(inputContext.itemType) ||
          typeof inputContext.itemId !== 'string' || !inputContext.itemId.trim()) {
          return badRequest('Enabled context requires a valid item type and item ID');
        }
        context = {
          enabled: true,
          itemType: inputContext.itemType as ChatContext['itemType'],
          itemId: inputContext.itemId.trim(),
        };
      } else {
        context = { enabled: false };
      }
    }

    if (query.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Query too long', message: 'Please keep questions under 500 characters.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Topics we refuse before any model call (work authorisation, compensation,
    // interview logistics). Answered deterministically, streamed in the same
    // shape as a normal answer so the client needs no special case.
    const denied = checkDenyList(query);
    if (denied) {
      if (shouldStream) {
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'metadata', citations: [] }) + '\n'));
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'chunk', content: denied }) + '\n'));
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'done' }) + '\n'));
            controller.close();
          },
        });
        return new Response(stream, {
          headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-cache' },
        });
      }
      return new Response(
        JSON.stringify({ answer: denied, citations: [], confidence: 1 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If streaming is requested
    if (shouldStream) {
      // Resolve all retrieval attempts and graceful fallbacks before citations.
      const prepared = await prepareRAGContext(query, context);
      const citations = extractCitations(prepared.chunks);

      // Create a readable stream
      const encoder = new TextEncoder();
      const generationController = new AbortController();
      let cancelled = false;
      const abortGeneration = () => generationController.abort(request.signal.reason);
      const detachAbortListener = () => request.signal.removeEventListener('abort', abortGeneration);
      if (request.signal.aborted) abortGeneration();
      else request.signal.addEventListener('abort', abortGeneration, { once: true });
      const stream = new ReadableStream({
        async start(controller) {
          try {
            if (generationController.signal.aborted) return;
            // Send initial metadata with citations
            const metadata = JSON.stringify({ type: 'metadata', citations }) + '\n';
            controller.enqueue(encoder.encode(metadata));

            // Stream the response
            for await (const chunk of streamRAGResponse(query, context, prepared, generationController.signal)) {
              if (generationController.signal.aborted) break;
              const data = JSON.stringify({ type: 'chunk', content: chunk }) + '\n';
              controller.enqueue(encoder.encode(data));
            }

            // Send completion marker
            if (!generationController.signal.aborted) {
              const done = JSON.stringify({ type: 'done' }) + '\n';
              controller.enqueue(encoder.encode(done));
            }
          } catch (error) {
            if (generationController.signal.aborted) return;
            console.error('Streaming error:', error);
            const errorData = JSON.stringify({
              type: 'error',
              error: error instanceof Error ? error.message : 'Streaming failed',
            }) + '\n';
            controller.enqueue(encoder.encode(errorData));
          } finally {
            detachAbortListener();
            if (!cancelled) controller.close();
          }
        },
        cancel(reason) {
          cancelled = true;
          generationController.abort(reason);
          detachAbortListener();
        },
      });

      return new Response(stream, {
        headers: {
          // Newline-delimited JSON, not SSE — the client parses lines.
          'Content-Type': 'application/x-ndjson',
          'Cache-Control': 'no-cache',
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
