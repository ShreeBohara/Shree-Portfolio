import { retrieveRelevantContent, extractCitations, RetrievedChunk } from './retrieval';
import { buildMessages } from './prompts';
import { getOpenAIClient, isOpenAIConfigured } from './client';
import { AI_CONFIG } from './config';
import { Citation } from '@/data/types';
import { projects, experiences, education } from '@/data/portfolio';
import { chunkProject, chunkExperience, chunkEducation, ContentChunk } from './chunking';
import { isVectorStoreAvailable } from './vector-store';

export interface ChatContext {
  enabled?: boolean;
  itemType?: 'project' | 'experience' | 'education';
  itemId?: string;
}

export interface RAGResponse {
  answer: string;
  citations: Citation[];
  confidence: number;
}

export interface PreparedRAGContext {
  chunks: RetrievedChunk[];
  fallback?: RAGResponse;
}

// When retrieval or the model is unavailable we say so. The previous fallback
// answered from a canned script that claimed skills (TensorFlow, PyTorch) which
// appear nowhere in the portfolio data — an outage produced confident fiction.
const UNAVAILABLE_MESSAGE =
  "The assistant is unavailable right now, so I can't look anything up. The projects and experience pages have the same material, and Shree is reachable at shreetbohara@gmail.com.";

const NO_MATCH_MESSAGE =
  "I couldn't find supporting material on the site for that question. Try asking about a specific project or experience, or reach Shree at shreetbohara@gmail.com.";

function unavailableResponse(): RAGResponse {
  return { answer: UNAVAILABLE_MESSAGE, citations: [], confidence: 0 };
}

function noMatchResponse(): RAGResponse {
  return { answer: NO_MATCH_MESSAGE, citations: [], confidence: 0 };
}

function isProjectOverviewQuery(query: string): boolean {
  const normalized = query.toLowerCase();
  return (
    /\bprojects?\b/.test(normalized) &&
    (
      /\btop\b/.test(normalized) ||
      /\bbest\b/.test(normalized) ||
      /\bfeatured\b/.test(normalized) ||
      /\bfavorite\b/.test(normalized) ||
      /\bhighlight(s)?\b/.test(normalized) ||
      /\bportfolio\b/.test(normalized) ||
      /\bwhat are\b/.test(normalized)
    )
  );
}

function getProjectCategoryMatcher(query: string): ((category: string) => boolean) | null {
  const normalized = query.toLowerCase();

  if (normalized.includes('ai/ml') || normalized.includes('machine learning') || /\bai\b/.test(normalized) || /\bml\b/.test(normalized)) {
    return (category) => category === 'AI/ML';
  }
  if (normalized.includes('full-stack') || normalized.includes('full stack')) {
    return (category) => category === 'Full-Stack';
  }
  if (normalized.includes('open source')) {
    return (category) => category === 'Open Source';
  }
  if (normalized.includes('academic')) {
    return (category) => category === 'Academic';
  }
  if (normalized.includes('data')) {
    return (category) => category === 'Data Engineering';
  }

  return null;
}

function buildDeterministicProjectOverviewChunks(query: string): RetrievedChunk[] {
  const categoryMatcher = getProjectCategoryMatcher(query);
  const matchingProjects = categoryMatcher
    ? projects.filter((project) => categoryMatcher(project.category))
    : projects;

  const rankedProjects = [...matchingProjects].sort((a, b) => {
    if (a.featured !== b.featured) {
      return Number(b.featured) - Number(a.featured);
    }
    if (a.year !== b.year) {
      return b.year - a.year;
    }
    return a.sortOrder - b.sortOrder;
  });

  return rankedProjects.slice(0, 3).flatMap((project, projectIndex) => {
    const projectChunks = chunkProject(project);
    const selectedChunks = [projectChunks[0], projectChunks[2] || projectChunks[1]].filter(Boolean);

    return selectedChunks.map((chunk, chunkIndex) => ({
      ...chunk,
      similarity: Math.max(0.95 - projectIndex * 0.05 - chunkIndex * 0.01, 0.8),
    }));
  });
}

function countUniqueProjects(chunks: RetrievedChunk[]): number {
  return new Set(
    chunks
      .filter((chunk) => chunk.metadata.type === 'project')
      .map((chunk) => chunk.metadata.itemId)
  ).size;
}

function getKnownItemChunks(context?: ChatContext): RetrievedChunk[] {
  if (!context?.enabled || !context.itemId) return [];
  let chunks: ContentChunk[] = [];
  if (context.itemType === 'project') {
    const item = projects.find((project) => project.id === context.itemId);
    if (item) chunks = chunkProject(item);
  } else if (context.itemType === 'experience') {
    const item = experiences.find((experience) => experience.id === context.itemId);
    if (item) chunks = chunkExperience(item);
  } else if (context.itemType === 'education') {
    const item = education.find((entry) => entry.id === context.itemId);
    if (item) chunks = chunkEducation(item);
  }
  // These are an exact item match, not a measured semantic similarity. Keep
  // confidence conservative while grounding the model in the current page data.
  return chunks.map((chunk) => ({ ...chunk, similarity: 0.5 }));
}

function normalizeProjectName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

// Use distinctive names and explicit project phrases, not technology/category
// keywords such as "AI", "trading" or "DuckDB" alone. Those can be general
// questions and should continue through semantic retrieval.
const PROJECT_ALIASES: Record<string, string[]> = {
  'project-faultlab': ['fault lab'],
  'project-codebaseqa': ['codebase qa'],
  'project-genomecanvas': ['genome canvas'],
  'project-delta-sentinel': ['deltasentinel'],
  'project-trading': ['trading system', 'trading project', 'options trading project'],
  'project-duckdb': ['duckdb hash join', 'duckdb optimization'],
  'project-portfolio': ['interactive portfolio'],
};

function getExplicitProjectChunks(query: string): RetrievedChunk[] {
  const normalizedQuery = ` ${normalizeProjectName(query)} `;
  const namedProjects = projects.filter((project) =>
    [project.title, project.slug, ...(PROJECT_ALIASES[project.id] ?? [])]
      .some((name) => normalizedQuery.includes(` ${normalizeProjectName(name)} `))
  );

  // Comparisons retain every explicitly named project. Content comes only from
  // the public catalog; a saved index need not contain these projects yet.
  // The fixed score is a local lookup marker, not semantic similarity or a
  // measured probability that the generated answer is correct.
  return namedProjects.flatMap((project) =>
    chunkProject(project).map((chunk) => ({ ...chunk, similarity: 0.5 }))
  );
}

export async function resolveRetrievedChunks(
  query: string,
  context?: ChatContext
): Promise<RetrievedChunk[]> {
  const hasSelectedItem = Boolean(context?.enabled && context?.itemId);
  if (hasSelectedItem) {
    // A selected page takes precedence even when the question names another
    // project. Never broaden its scope with name matching or stale index hits.
    const knownItemChunks = getKnownItemChunks(context);
    if (knownItemChunks.length > 0) return knownItemChunks;
  } else {
    const namedProjectChunks = getExplicitProjectChunks(query);
    if (namedProjectChunks.length > 0) return namedProjectChunks;
  }

  const options = {
    limit: AI_CONFIG.retrieval.topK,
    filter: context?.enabled && context?.itemId
      ? {
        type: context.itemType,
        itemId: context.itemId,
      }
      : undefined,
    boostItemId: context?.enabled ? context.itemId : undefined,
  };
  let retrievedChunks = await retrieveRelevantContent(query, options);

  if (!(context?.enabled && context?.itemId) && isProjectOverviewQuery(query)) {
    const deterministicProjectChunks = buildDeterministicProjectOverviewChunks(query);
    const projectOnlyChunks = retrievedChunks.filter((chunk) => chunk.metadata.type === 'project');
    const shouldUseDeterministicFallback =
      retrievedChunks.length === 0 ||
      projectOnlyChunks.length === 0 ||
      countUniqueProjects(projectOnlyChunks) < 3;

    if (shouldUseDeterministicFallback) {
      return deterministicProjectChunks;
    }

    return projectOnlyChunks;
  }

  if (retrievedChunks.length === 0) {
    // Resolve the fallback before the route sends citations, preserving the
    // selected item for contextual questions in both response modes.
    retrievedChunks = await retrieveRelevantContent(query, {
      ...options,
      limit: 5,
      minScore: 0.25,
    });
  }

  return retrievedChunks;
}

/**
 * Complete retrieval before producing either citations or an answer. Missing
 * services, retrieval failures and empty results never reach the model.
 */
export async function prepareRAGContext(
  query: string,
  context?: ChatContext
): Promise<PreparedRAGContext> {
  try {
    if (!isOpenAIConfigured() || !isVectorStoreAvailable()) {
      return { chunks: [], fallback: unavailableResponse() };
    }
    const chunks = await resolveRetrievedChunks(query, context);
    if (chunks.length === 0) {
      return { chunks, fallback: noMatchResponse() };
    }
    return { chunks };
  } catch (error) {
    console.error('RAG retrieval error:', error);
    return { chunks: [], fallback: unavailableResponse() };
  }
}

/** Retrieves supporting material and generates a grounded response. */
export async function getRAGResponse(
  query: string,
  context?: ChatContext,
  preparedContext?: PreparedRAGContext
): Promise<RAGResponse> {
  const prepared = preparedContext ?? await prepareRAGContext(query, context);
  if (prepared.fallback) return prepared.fallback;
  if (prepared.chunks.length === 0) return noMatchResponse();

  try {
    const retrievedChunks = prepared.chunks;

    // Extract citations
    const citations = extractCitations(retrievedChunks);

    // Build messages for OpenAI
    const messages = buildMessages(query, retrievedChunks, context);

    // Generate response using OpenAI
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
    });

    const answer = completion.choices[0]?.message?.content;
    if (!answer) return unavailableResponse();

    // Calculate confidence based on retrieved chunks similarity scores
    const avgSimilarity = retrievedChunks.reduce((sum, chunk) => sum + chunk.similarity, 0) / retrievedChunks.length;

    return {
      answer,
      citations,
      confidence: Math.min(avgSimilarity, 0.95), // Cap at 0.95
    };
  } catch (error) {
    console.error('RAG error:', error);
    return unavailableResponse();
  }
}

/**
 * Streams RAG response using OpenAI streaming API
 */
export async function* streamRAGResponse(
  query: string,
  context?: ChatContext,
  // Preparation resolves every retrieval attempt before the route sends its
  // citation list, so the sources shown are the sources the model actually saw.
  preparedContext?: PreparedRAGContext,
  signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  if (signal?.aborted) return;
  const prepared = preparedContext ?? await prepareRAGContext(query, context);
  if (signal?.aborted) return;
  if (prepared.fallback) {
    yield prepared.fallback.answer;
    return;
  }
  if (prepared.chunks.length === 0) {
    yield NO_MATCH_MESSAGE;
    return;
  }

  try {
    const retrievedChunks = prepared.chunks;

    // Build messages for OpenAI
    const messages = buildMessages(query, retrievedChunks, context);

    // Stream response using OpenAI
    const openai = getOpenAIClient();
    const stream = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
      stream: true,
    }, { signal });

    let hasContent = false;
    for await (const chunk of stream) {
      if (signal?.aborted) return;
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        hasContent = true;
        yield content;
      }
    }
    if (!hasContent) throw new Error('The model returned an empty response');
  } catch (error) {
    if (signal?.aborted) return;
    console.error('RAG streaming error:', error);
    // A partial answer must be reported as failed, not completed with outage
    // text appended to it. The route emits an error event the client can retry.
    throw new Error(UNAVAILABLE_MESSAGE);
  }
}
