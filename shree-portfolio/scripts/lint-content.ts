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
import { join, relative } from 'path';

interface Rule {
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

interface Violation {
  file: string;
  line: number;
  match: string;
  why: string;
}

function lint(): Violation[] {
  const violations: Violation[] = [];

  for (const file of walk(CONTENT_DIR)) {
    const rel = relative(ROOT, file);
    const lines = readFileSync(file, 'utf8').split('\n');

    for (const rule of RULES) {
      // A scoped rule only applies to files whose path contains one of its keys.
      if (rule.files && !rule.files.some((key) => rel.includes(key))) continue;

      const regex = new RegExp(rule.pattern, 'i');

      lines.forEach((text, index) => {
        // Frontmatter `source:` lines cite corpus rows by name, so a rule word
        // appearing there is a citation, not a claim.
        if (/^\s*source:/.test(text)) return;
        const match = regex.exec(text);
        if (match) {
          violations.push({ file: rel, line: index + 1, match: match[0], why: rule.why });
        }
      });
    }
  }

  return violations;
}

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

console.log(`Content lint passed: ${RULES.length} rules, no violations.`);
