import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import * as motion from 'framer-motion';
import * as icons from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ts from 'typescript';
import { cn } from '../src/lib/utils';
import { ACCENT, accentAlpha } from '../src/lib/accent';
import { checkDenyList } from '../src/lib/ai/deny';
import { readChatResponse } from '../src/lib/ai/chat-stream';
import type { Citation } from '../src/data/types';
import { getChatLinkHref } from '../src/lib/chat-links';

type ChatRoute = typeof import('../src/app/api/chat/route');

// Load the real route and real deny rules, with all service entry points sealed.
// Any accidental retrieval/generation call is recorded and fails the response.
function loadRoute(allowed = true) {
  const serviceCalls: string[] = [];
  const denyQueries: string[] = [];
  const now = Date.parse('2026-10-04T12:00:00Z');
  class FixedDate extends Date {
    static now() { return now; }
  }
  const unexpected = (service: string) => {
    serviceCalls.push(service);
    throw new Error(`Unexpected service call: ${service}`);
  };
  const dependencies: Record<string, unknown> = {
    '@/lib/ai/rag': {
      prepareRAGContext: () => unexpected('prepare'),
      getRAGResponse: () => unexpected('generate'),
      streamRAGResponse: () => unexpected('stream'),
    },
    '@/lib/ai/retrieval': { extractCitations: () => unexpected('citations') },
    '@/lib/ai/rate-limit': {
      checkRateLimit: async () => allowed,
      getRemainingRequests: () => 0,
      getResetTime: () => now + 30_000,
      getRateLimitMax: () => 10,
    },
    '@/lib/ai/deny': {
      checkDenyList: (query: string) => {
        denyQueries.push(query);
        return checkDenyList(query);
      },
    },
  };
  const filename = resolve('src/app/api/chat/route.ts');
  const loaded = { exports: {} };
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  }).outputText;
  runInNewContext(code, {
    module: loaded, exports: loaded.exports,
    require: (name: string) => {
      assert.ok(name in dependencies, `Unmocked route dependency: ${name}`);
      return dependencies[name];
    },
    console: { error() {} },
    Response, TextEncoder, ReadableStream, AbortController, Date: FixedDate,
  }, { filename });
  return { route: loaded.exports as ChatRoute, serviceCalls, denyQueries, now };
}

function request(route: ChatRoute, query: string, stream: boolean) {
  return route.POST(new Request('https://portfolio.example/api/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query, stream,
      context: { enabled: true, itemType: 'project', itemId: 'project-faultlab' },
    }),
  }) as Parameters<ChatRoute['POST']>[0]);
}

test('real privacy refusals bypass retrieval and generation in both API modes', async () => {
  const { route, serviceCalls, denyQueries } = loadRoute();
  for (const query of [
    'Does Shree need visa sponsorship?',
    'How much should we pay Shree?',
    'What are his personal weaknesses?',
    'What is your earliest start date?',
    'What is his phone number?',
  ]) {
    const expected = checkDenyList(query);
    assert.ok(expected);
    const ordinary = await request(route, query, false);
    assert.equal(ordinary.status, 200);
    assert.deepEqual(await ordinary.json(), { answer: expected, citations: [], confidence: 1 });

    const streamed = await request(route, query, true);
    assert.equal(streamed.status, 200);
    assert.equal(streamed.headers.get('Content-Type'), 'application/x-ndjson');
    const events = [];
    for await (const event of readChatResponse(streamed)) events.push(event);
    assert.deepEqual(events, [
      { type: 'metadata', citations: [] },
      { type: 'chunk', content: expected },
      { type: 'done' },
    ]);
  }
  assert.equal(denyQueries.length, 10);
  assert.deepEqual(serviceCalls, []);
});

test('quota rejection precedes privacy and services and supplies usable retry headers', async () => {
  const { route, serviceCalls, denyQueries, now } = loadRoute(false);
  for (const stream of [false, true]) {
    const response = await request(route, 'Does Shree need visa sponsorship?', stream);
    assert.equal(response.status, 429);
    assert.equal(response.headers.get('Retry-After'), '30');
    assert.equal(response.headers.get('X-RateLimit-Limit'), '10');
    assert.equal(response.headers.get('X-RateLimit-Remaining'), '0');
    assert.equal(response.headers.get('X-RateLimit-Reset'), String(now + 30_000));
    const body = await response.json();
    assert.equal(body.error, 'Rate limit exceeded');
    assert.equal(body.retryAfter, 30);
    assert.match(body.message, /2026-10-04T12:00:30\.000Z/);
  }
  assert.deepEqual(denyQueries, []);
  assert.deepEqual(serviceCalls, []);
});

function renderCitation(citation: Citation, content = 'Documented summary.') {
  // The actual component renders with its libraries, but without browser
  // preference storage or calendar controls unrelated to citation semantics.
  const filename = resolve('src/components/chat/Message.tsx');
  const loaded = { exports: {} };
  const dependencies: Record<string, unknown> = {
    react: React,
    'react/jsx-runtime': jsxRuntime,
    'framer-motion': motion,
    'lucide-react': icons,
    'react-markdown': { default: ReactMarkdown },
    'remark-gfm': { default: remarkGfm },
    '@/lib/utils': { cn },
    '@/lib/accent': { ACCENT, accentAlpha },
    '@/lib/chat-links': { getChatLinkHref },
    '@/store/ui-store': { useUIStore: () => ({ setSelectedItem() {} }) },
    './CalendlyCTA': { CalendlyCTA: () => null },
  };
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
    },
    fileName: filename,
  }).outputText;
  runInNewContext(code, {
    module: loaded, exports: loaded.exports,
    require: (name: string) => {
      assert.ok(name in dependencies, `Unmocked message dependency: ${name}`);
      return dependencies[name];
    },
  }, { filename });
  const { Message } = loaded.exports as typeof import('../src/components/chat/Message');
  return renderToStaticMarkup(jsxRuntime.jsx(Message, {
    role: 'assistant', content, citations: [citation],
  }));
}

test('citations without a destination render as source labels rather than dead buttons', () => {
  for (const type of ['bio', 'skill', 'faq', 'story', 'philosophy', 'interests', 'workstyle', 'resume'] as const) {
    const markup = renderCitation({ type, id: 'source', title: 'Current source' });
    assert.match(markup, /Current source/);
    assert.match(markup, /font-mono text-xs/);
    assert.doesNotMatch(markup, /<button\b|role="button"|tabindex=/i, type);
  }
});

test('catalog citations and explicit source URLs retain actionable buttons', () => {
  for (const citation of [
    { type: 'project', id: 'project-faultlab', title: 'FaultLab' },
    { type: 'experience', id: 'exp-quinstreet-ft', title: 'QuinStreet' },
    { type: 'education', id: 'edu-1', title: 'USC' },
    { type: 'bio', id: 'personal-info', title: 'About Shree', url: '/about' },
  ] satisfies Citation[]) {
    const markup = renderCitation(citation);
    assert.equal((markup.match(/<button\b/g) ?? []).length, 1, citation.title);
    assert.ok(markup.includes(citation.title));
  }
});

test('a literal public project path links to its own page while a separate write-up keeps its supplied destination', () => {
  const document = 'https://drive.google.com/file/d/17oY5R0iapf8BO_JjkOiEjuidUVGxTYII/view';
  const path = '/projects/duckdb-hash-join-optimization';
  const markup = renderCitation({ type: 'project', id: 'project-duckdb', title: 'DuckDB' },
    `[${path}](${document}) and [Engineering write-up](${document})`);
  assert.match(markup, /href="\/projects\/duckdb-hash-join-optimization"/);
  assert.ok(markup.includes(`href="${document}"`));
  assert.equal(getChatLinkHref('/not-a-published-page', document), document);
});

test('a generated placeholder destination renders readable text rather than a dead link', () => {
  const markup = renderCitation({ type: 'experience', id: 'exp-quinstreet-ft', title: 'QuinStreet' },
    '[Software Engineer at QuinStreet - 2026](#)');
  assert.match(markup, /Software Engineer at QuinStreet - 2026/);
  assert.doesNotMatch(markup, /<a\b|href="#"/);
});
