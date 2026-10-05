/**
 * Fails the build when content contains a string the résumé corpus forbids.
 *
 * The corpus spent months deciding which numbers are defensible, which framings
 * are retired, and which employer detail may be published. Those decisions were
 * previously kept by discipline alone, and the live site drifted anyway: it
 * served a retired line count and a stale job status for months. This turns the
 * rules into a build gate.
 *
 * Run: npx tsx scripts/lint-content.ts
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { basename, join, relative } from 'path';
import { personalInfo, projects, experiences, education } from '../src/data/portfolio';

export interface Rule {
  pattern: string;
  why: string;
  files?: string[];
}

const ROOT = process.cwd();
const CONTENT_DIR = join(ROOT, 'content');
const RULES: Rule[] = JSON.parse(readFileSync(join(CONTENT_DIR, 'forbidden.json'), 'utf8')).rules;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith('.mdx') || full.endsWith('.md') ? [full] : [];
  });
}

export interface Violation {
  file: string;
  line: number;
  match: string;
  why: string;
}

function isQualifiedTradingLimit(text: string, match: RegExpExecArray, rule: Rule): boolean {
  // This rule rejects unsupported trading-performance claims. An explicit
  // limitation such as "never trades live" or "no P&L claim" says the opposite.
  // Do not apply this exception to privacy rules: a private identifier stays
  // private even when a sentence denies something about it.
  if (rule.pattern !== 'trades live|live trading|P&L|win rate|Sharpe') return false;
  const prefix = text.slice(0, match.index).split(/[.!?;\n]/).pop() ?? '';
  const suffix = text.slice(match.index + match[0].length).split(/[.!?;\n]/)[0];
  return /\b(?:never|no|not|without)\b(?:\s+[\w'-]+){0,6}\s*$/i.test(prefix) ||
    /^(?:\s+[\w'-]+){0,4}\s+(?:is|was|has been|have been)?\s*(?:not|never)\s+(?:enabled|validated|measured|proven|claimed|supported|implemented)\b/i.test(suffix);
}

export function lintText(text: string, file: string, rules: Rule[] = RULES): Violation[] {
  const violations: Violation[] = [];
  for (const rule of rules) {
    if (rule.files && !rule.files.some((key) => file.toLowerCase().includes(key.toLowerCase()))) continue;
    text.split('\n').forEach((line, index) => {
      if (/^\s*source:/.test(line)) return;
      // Check every occurrence: a qualified first mention cannot hide a later
      // positive claim on the same line.
      for (const match of line.matchAll(new RegExp(rule.pattern, 'gi'))) {
        if (isQualifiedTradingLimit(line, match, rule)) continue;
        violations.push({ file, line: index + 1, match: match[0], why: rule.why });
      }
    });
  }
  return violations;
}

/** Walk actual exported strings, including links/tags, rather than TS comments. */
export function lintPublicStrings(value: unknown, file: string, rules: Rule[] = RULES): Violation[] {
  if (typeof value === 'string') return lintText(value, file, rules);
  if (Array.isArray(value)) return value.flatMap((item, index) => lintPublicStrings(item, `${file}[${index}]`, rules));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) =>
      key === 'source' ? [] : lintPublicStrings(item, `${file}.${key}`, rules)
    );
  }
  return [];
}

export function lint(): Violation[] {
  const violations: Violation[] = [];

  for (const file of walk(CONTENT_DIR)) {
    const rel = relative(ROOT, file);
    violations.push(...lintText(readFileSync(file, 'utf8'), rel));
  }

  // Classic pages and the assistant consume these exports, independently of
  // MDX. Project/experience identity keeps existing scoped rules effective even
  // when their source moves into a dedicated catalog module.
  violations.push(...lintPublicStrings(personalInfo, 'catalog/personalInfo'));
  for (const project of projects) violations.push(...lintPublicStrings(project, `catalog/projects/${project.slug}`));
  for (const experience of experiences) violations.push(...lintPublicStrings(experience, `catalog/experiences/${experience.company}/${experience.id}`));
  for (const item of education) violations.push(...lintPublicStrings(item, `catalog/education/${item.id}`));

  return violations;
}

if (['lint-content.ts', 'lint-content.js'].includes(basename(process.argv[1] ?? ''))) {
  const violations = lint();

  if (violations.length > 0) {
    console.error(`\nForbidden content found (${violations.length}):\n`);
    for (const v of violations) {
      console.error(`  ${v.file}:${v.line}  "${v.match}"`);
      console.error(`    ${v.why}\n`);
    }
    console.error('These strings are barred by the résumé corpus. Fix the copy, or');
    console.error('change the rule in content/forbidden.json if the corpus changed.\n');
    process.exit(1);
  }

  console.log(`Content lint passed: ${RULES.length} rules across MDX and the public catalog, no violations.`);
}
