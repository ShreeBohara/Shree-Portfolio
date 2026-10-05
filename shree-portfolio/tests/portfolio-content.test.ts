import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import type { ReactNode } from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { projects, experiences, education, personalInfo } from '../src/data/portfolio';
import { contentUpdatedAt, siteDescription } from '../src/data/site';
import { chunkProject, chunkExperience, chunkPersonalInfo, chunkAllContent } from '../src/lib/ai/chunking';
import { lint, lintText, lintPublicStrings, type Rule } from '../scripts/lint-content';

function loadPublicModule<T>(file: string, extra: Record<string, unknown> = {}): T {
  const filename = resolve(file);
  const loaded = { exports: {} };
  const dependencies: Record<string, unknown> = {
    'react/jsx-runtime': jsxRuntime,
    'next/image': { default: ({ src, alt }: { src: string; alt: string }) => jsxRuntime.jsx('img', { src, alt }) },
    'next/navigation': { notFound: () => { throw new Error('Missing project'); } },
    '@/data/portfolio': { projects, experiences, education, personalInfo },
    '@/data/site': { contentUpdatedAt, siteDescription },
    '@/lib/schemas': { ProjectSchema: () => null, BreadcrumbListSchema: () => null },
    '@/components/layout/PortfolioLayout': { PortfolioLayout: ({ children }: { children: ReactNode }) => children },
    ...extra,
  };
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    fileName: filename,
  }).outputText;
  runInNewContext(code, {
    module: loaded, exports: loaded.exports,
    process: { env: { NEXT_PUBLIC_SITE_URL: 'https://portfolio.test' } },
    require: (name: string) => {
      assert.ok(name in dependencies, `Unmocked public-page dependency: ${name}`);
      return dependencies[name];
    },
  }, { filename });
  return loaded.exports as T;
}

test('FaultLab reaches catalog retrieval and the rendered project-to-case-study link', async () => {
  const project = projects.find(item => item.slug === 'faultlab');
  assert.ok(project, 'Browse and project routes need a classic catalog entry');
  const chunks = chunkProject(project);
  assert.ok(chunks.every(chunk => chunk.metadata.itemId === project.id));
  assert.ok(chunks.some(chunk => /zero generated policies were accepted/.test(chunk.content)));
  assert.ok(chunks.some(chunk => /AI-assisted/.test(chunk.content)));

  const filename = resolve('src/app/projects/[slug]/page.tsx');
  const compiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
    fileName: filename,
  }).outputText;
  const loaded = { exports: {} };
  const dependencies: Record<string, unknown> = {
    'react/jsx-runtime': jsxRuntime,
    'next/image': { default: ({ src, alt }: { src: string; alt: string }) => jsxRuntime.jsx('img', { src, alt }) },
    'next/navigation': { notFound: () => { throw new Error('Unexpected missing project'); } },
    '@/data/portfolio': { projects },
    '@/lib/schemas': { ProjectSchema: () => null, BreadcrumbListSchema: () => null },
    '@/components/layout/PortfolioLayout': { PortfolioLayout: ({ children }: { children: ReactNode }) => children },
  };
  runInNewContext(compiled, {
    module: loaded, exports: loaded.exports, process: { env: {} },
    require: (name: string) => {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
      return dependencies[name];
    },
  }, { filename });
  const page = loaded.exports as {
    default: (props: { params: Promise<{ slug: string }> }) => Promise<ReactNode>;
    generateStaticParams: () => Promise<Array<{ slug: string }>>;
  };
  assert.ok((await page.generateStaticParams()).some(params => params.slug === project.slug));
  const markup = renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug: project.slug }) }));
  assert.equal(project.links.caseStudy, '/work/faultlab');
  assert.match(markup, /href="\/work\/faultlab"[^>]*>Read Case Study<\/a>/);
  assert.match(markup, /Aryan Bhusari/);
  assert.equal(project.links.live, undefined);
  const caseStudy = readFileSync(resolve(`content${project.links.caseStudy}.mdx`), 'utf8');
  assert.match(caseStudy, /title: FaultLab/);
  assert.match(caseStudy, /coAuthored: true/);
});

test('FaultLab public content preserves historical evidence and unaccepted continuation limits', () => {
  const caseStudy = readFileSync(resolve('content/work/faultlab.mdx'), 'utf8');
  assert.match(caseStudy, /September 14, 2026 campaign only/);
  assert.match(caseStudy, /value: 143 of 143/);
  assert.match(caseStudy, /source: "facts\.md: FaultLab › Weave traces verified"/);
  assert.match(caseStudy, /id: generated-accepted[\s\S]*?value: "0"/);
  assert.match(caseStudy, /September 30, 2026/);
  assert.match(caseStudy, /not offered in normal Learn runs/);
  assert.match(caseStudy, /request-only probe/);
  assert.match(caseStudy, /status: repo/);
  assert.doesNotMatch(caseStudy, /^\s+live:/m);
});

test('the complete catalog reaches static routes, detail metadata, sitemap and uniquely identified chat chunks', async () => {
  type Page = {
    default: (props: { params: Promise<{ slug: string }> }) => Promise<ReactNode>;
    generateStaticParams: () => Promise<Array<{ slug: string }>>;
    generateMetadata: (props: { params: Promise<{ slug: string }> }) => Promise<{ title: string; description?: string; alternates?: { canonical: string } }>;
  };
  const page = loadPublicModule<Page>('src/app/projects/[slug]/page.tsx');
  const site = loadPublicModule<{ default: () => Array<{ url: string }> }>('src/app/sitemap.ts');
  const params = await page.generateStaticParams();
  const slugs = projects.map(project => project.slug);
  assert.equal(new Set(slugs).size, projects.length, 'ambiguous slugs break routes and citations');
  assert.equal(new Set(projects.map(project => project.id)).size, projects.length);
  assert.deepEqual(Array.from(params, value => value.slug).sort(), [...slugs].sort());
  const urls = site.default().map(item => item.url);
  assert.equal(new Set(urls).size, urls.length, 'sitemap entries should not repeat');

  const chunks = chunkAllContent(projects, experiences, education, personalInfo);
  assert.equal(new Set(chunks.map(chunk => chunk.id)).size, chunks.length, 'index refresh requires unique stable chunk IDs');
  for (const project of projects) {
    assert.ok(urls.includes(`https://portfolio.test/projects/${project.slug}`), project.slug);
    const props = { params: Promise.resolve({ slug: project.slug }) };
    const metadata = await page.generateMetadata(props);
    assert.equal(metadata.title, project.title);
    assert.equal(metadata.description, project.summary);
    assert.equal(metadata.alternates?.canonical, `https://portfolio.test/projects/${project.slug}`);
    const markup = renderToStaticMarkup(await page.default(props));
    assert.match(markup, /<h1\b/);
    assert.match(markup, /<h2[^>]*>My Role<\/h2>/, `authorship must reach ${project.slug}'s public page`);
    const indexed = chunks.filter(chunk => chunk.metadata.type === 'project' && chunk.metadata.itemId === project.id);
    assert.ok(indexed.length >= 3, project.slug);
    assert.ok(indexed.some(chunk => chunk.content.includes(project.impact)), `limits must reach chat for ${project.slug}`);
    assert.ok(indexed.some(chunk => chunk.content.includes(project.myRole)), `authorship must reach chat for ${project.slug}`);
    assert.ok(indexed.every(chunk => chunk.metadata.title === project.title));
    if (project.links.caseStudy?.startsWith('/')) {
      assert.ok(readFileSync(resolve(`content${project.links.caseStudy}.mdx`), 'utf8').length > 0, 'internal case studies must exist');
      assert.ok(markup.includes(`href="${project.links.caseStudy}"`));
    }
    if (project.images?.thumbnail) {
      assert.ok(readFileSync(resolve(`public${project.images.thumbnail}`)).length > 0, 'catalog images must exist');
    }
  }
  await assert.rejects(page.default({ params: Promise.resolve({ slug: 'retired-unlisted-project' }) }), /Missing project/);
});

test('career source corrections and employer publication limits reach the public data and chat', () => {
  const current = experiences.filter(item => item.current);
  assert.equal(current.length, 1);
  assert.equal(current[0].company, 'QuinStreet');
  assert.equal(current[0].role, 'Software Engineer');
  assert.equal(current[0].startDate, '2026-06');
  assert.equal(current[0].endDate, null);
  const internship = experiences.find(item => item.company === 'QuinStreet' && item.type === 'Internship');
  assert.ok(internship);
  assert.equal(internship.startDate, '2025-06');
  assert.equal(internship.endDate, current[0].startDate);
  assert.ok(education.some(item => item.institution === 'University of Southern California' && item.endYear === 2026));
  assert.match(personalInfo.bio, /completed[\s\S]*M\.S\.[\s\S]*May 2026/);
  assert.equal(personalInfo.jobSearch, undefined, 'private immigration/application information is not public RAG material');

  const employerText = experiences.map(item => JSON.stringify(item)).join('\n');
  assert.doesNotMatch(employerText, /\b(?:61K|44,300|324,500|34,203|7 to 8 bugs|28-day outage)\b|\$\d|\b(?:FROG|QSCM|IT)-\d+/i);
  assert.ok(current[0].technologies.includes('React'));
  assert.ok(current[0].technologies.includes('TypeScript'));
  const pipeline = current[0].highlights.find(item => /incident-analysis/i.test(item.text));
  assert.ok(pipeline);
  assert.match(pipeline.text, /dev and stage.*production data/i);
  const deeptek = experiences.find(item => /DeepTek/.test(item.company));
  assert.ok(deeptek);
  assert.ok(deeptek.technologies.includes('Node.js'));
  assert.doesNotMatch(JSON.stringify(deeptek), /Spring Boot|\bJWT\b/);

  const chunks = chunkAllContent(projects, experiences, education, personalInfo);
  assert.ok(chunks.some(chunk => chunk.content.includes(pipeline.text)));
  assert.ok(chunks.some(chunk => /completed[\s\S]*May 2026/.test(chunk.content)));
  assert.ok(chunks.every(chunk => !chunk.id.startsWith('jobsearch-')));
  const publicText = chunks.map(chunk => chunk.content).join('\n');
  assert.doesNotMatch(publicText, /\/Users\/|ssh:\/\/|SUPABASE_SERVICE_ROLE_KEY|OPENAI_API_KEY\s*=|Authorization:\s*Bearer|\b(?:FROG|QSCM|IT)-\d+/i);
});

test('project evidence preserves benchmark scope, unpublished work and trading execution limits in chat', () => {
  const textFor = (slug: string) => {
    const project = projects.find(item => item.slug === slug);
    assert.ok(project, `Missing refreshed project: ${slug}`);
    return { project, text: chunkProject(project).map(chunk => chunk.content).join('\n') };
  };
  const trading = textFor('algorithmic-options-trading-system');
  assert.match(trading.text, /349/);
  assert.match(trading.text, /zero broker submissions.*live execution was disabled/i);
  assert.match(trading.text, /effectiveness of every gate.*unproven/i);
  assert.equal(trading.project.links.github, undefined, 'private production source must not be linked');
  const cordon = textFor('cordon');
  assert.match(cordon.text, /10 handcrafted injections/);
  assert.match(cordon.text, /six of seven benign cases/);
  assert.match(cordon.text, /bounded synthetic evaluation/);
  const earshot = textFor('earshot');
  assert.match(earshot.text, /six of seven manually observed sessions/);
  assert.match(earshot.text, /not an accuracy benchmark/);
  assert.match(earshot.text, /2\.0[\s\S]*outside[\s\S]*public main branch/);
  const genome = textFor('genomecanvas');
  assert.match(genome.text, /52 real AlphaFold structures and two fallbacks/);
  assert.match(genome.text, /UMAP[\s\S]*not biological equivalence/);
  assert.match(genome.text, /optional Claude[\s\S]*local fallback/);
  assert.equal(genome.project.links.live, undefined);
  const duckdb = textFor('duckdb-hash-join-optimization');
  assert.match(duckdb.text, /1\.56× overall TPC-H speedup at 100 GB/);
  assert.match(duckdb.text, /135 queries across three workloads/);
  assert.match(duckdb.text, /depend on the benchmark setup/);
  assert.doesNotMatch(duckdb.text, /sole (?:author|authorship)|NeurIPS|SIGMOD|VLDB|published (?:paper|research)/i);
});

test('experience timelines and reordered career moments retain accurate chat facts and stable IDs', () => {
  for (const experience of experiences) {
    const chunks = chunkExperience(experience);
    const summary = chunks.find(chunk => chunk.id === `experience-${experience.id}-summary`);
    assert.ok(summary);
    assert.ok(summary.content.includes(`Period: ${experience.startDate} - ${experience.endDate ?? 'Present'}`));
    assert.ok(summary.content.includes(`Role Type: ${experience.type}`));
    assert.ok(summary.content.includes(`Location: ${experience.location}`));
    assert.ok(chunks.every(chunk => chunk.metadata.itemId === experience.id));
  }

  assert.ok(personalInfo.careerStory);
  const moments = [...personalInfo.careerStory.keyMoments].reverse();
  const reordered = { ...personalInfo, careerStory: { ...personalInfo.careerStory, keyMoments: moments } };
  const chunks = chunkPersonalInfo(reordered).filter(chunk => chunk.id.startsWith('story-moment-'));
  assert.deepEqual(chunks.map(chunk => chunk.id), moments.map((_, index) => `story-moment-${index}`));
  for (const [index, chunk] of chunks.entries()) {
    assert.equal(chunk.metadata.title, `Career Milestone ${index + 1}`);
    assert.ok(chunk.content.includes(moments[index]));
    assert.equal(chunk.metadata.itemId, 'career-story');
  }
});

test('content lint scans real public catalog strings with scoped rules and qualified limitations', () => {
  assert.deepEqual(lint(), [], 'content and classic page/chat catalog share the publication gate');
  const rules: Rule[] = [
    { pattern: 'trades live|live trading|P&L|win rate|Sharpe', why: 'Unsupported trading claims' },
    { pattern: '\\bled\\b', why: 'DeepTek leadership claim is not established', files: ['deeptek'] },
    { pattern: 'private-host', why: 'Private identifier must not be published' },
  ];
  assert.equal(lintText('It never trades live and has no P&L claim.', 'catalog/projects/trading', rules).length, 0);
  assert.equal(lintText('No P&L claim; the system trades live.', 'catalog/projects/trading', rules).length, 1);
  assert.equal(lintText('It does not use private-host.', 'catalog/projects/trading', rules).length, 1, 'negation must not exempt confidential identifiers');
  assert.equal(lintText('A model handles records.', 'catalog/experiences/deeptek', rules).length, 0);
  const violations = lintPublicStrings({ highlights: [{ text: 'Led the integration' }], source: 'Led is the retired wording' }, 'catalog/experiences/DeepTek', rules);
  assert.equal(violations.length, 1);
  assert.equal(violations[0].file, 'catalog/experiences/DeepTek.highlights[0].text');
  assert.equal(lintPublicStrings({ highlights: [{ text: 'Led the integration' }] }, 'catalog/projects/another-project', rules).length, 0);
});
