/**
 * Checks every number on the site against the résumé corpus.
 *
 * Frontmatter is the source of what the site *shows*; corpus/facts.md is the
 * source of what is *true*. This script reconciles them: a metric whose value
 * or confidence tag disagrees with its facts.md row fails, as does one citing a
 * row the corpus has retired or flagged.
 *
 * The corpus lives outside this repository and is owned by the résumé project,
 * so this runs locally and in CI when CORPUS_PATH is available. Vercel builds
 * run the content lint only.
 *
 * Run: CORPUS_PATH=~/Projects/Claude_Resume_Work/corpus npx tsx scripts/verify-facts.ts
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { homedir } from 'os';

const ROOT = process.cwd();
const CORPUS =
  process.env.CORPUS_PATH?.replace(/^~/, homedir()) ??
  join(homedir(), 'Projects/Claude_Resume_Work/corpus');

if (!existsSync(join(CORPUS, 'facts.md'))) {
  console.log(`Corpus not found at ${CORPUS} — skipping fact verification.`);
  console.log('Set CORPUS_PATH to run this check.');
  process.exit(0);
}

interface CorpusFact {
  section: string;
  label: string;
  value: string;
  confidence: string;
  notes: string;
  retired: boolean;
}

/** facts.md is a set of "## Section" headings over | Fact | Value | Confidence | Notes | tables. */
function parseFacts(): CorpusFact[] {
  const facts: CorpusFact[] = [];
  let section = '';

  for (const line of readFileSync(join(CORPUS, 'facts.md'), 'utf8').split('\n')) {
    const heading = /^##\s+(.+)$/.exec(line);
    if (heading) {
      section = heading[1].trim();
      continue;
    }

    if (!line.startsWith('|')) continue;
    const cells = line.split('|').map((cell) => cell.trim());
    if (cells.length < 5) continue;
    const [, label, value, confidence, notes = ''] = cells;
    if (!label || label === 'Fact' || /^-+$/.test(label)) continue;

    facts.push({
      section,
      label,
      value,
      confidence: confidence.toLowerCase(),
      notes,
      // The corpus marks retired or disputed rows with these glyphs.
      retired: /⛔|⚠|retired|disputed|unverified/i.test(`${confidence} ${notes} ${value}`),
    });
  }

  return facts;
}

function numbers(text: string): string[] {
  return (text.match(/\d[\d,]*\.?\d*/g) ?? []).map((n) => n.replace(/,/g, ''));
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith('.mdx') ? [full] : [];
  });
}

const corpusFacts = parseFacts();
const problems: string[] = [];
let checked = 0;
let skipped = 0;

for (const file of walk(join(ROOT, 'content'))) {
  const rel = relative(ROOT, file);
  const raw = readFileSync(file, 'utf8');

  // Walk the metrics array textually: the compiled collection is not available
  // when this runs standalone, and frontmatter is what we are auditing anyway.
  const blocks = raw.split(/^\s*- id:\s*/m).slice(1);

  for (const block of blocks) {
    const body = block.split(/\n\s*- id:/)[0];
    const id = body.split('\n')[0].trim();
    const value = /\n\s*value:\s*(.+)/.exec(body)?.[1]?.trim().replace(/^["']|["']$/g, '');
    const provenance = /\n\s*provenance:\s*(.+)/.exec(body)?.[1]?.trim();
    const source = /\n\s*source:\s*(.+)/.exec(body)?.[1]?.trim().replace(/^["']|["']$/g, '');
    if (!value || !provenance || !source) continue;

    const cite = /facts\.md:\s*(.+?)\s*›\s*(.+)/.exec(source);
    if (!cite) {
      skipped += 1; // sourced to a repo path or URL, not the corpus
      continue;
    }

    const [, sectionKey, label] = cite;
    // facts.md escapes Markdown characters in labels (e.g. "Mol\* bundle
    // contribution"); compare the unescaped forms.
    const unescape = (text: string) => text.toLowerCase().replace(/\\/g, '');
    const match = corpusFacts.find(
      (fact) =>
        fact.section.toLowerCase().includes(sectionKey.toLowerCase()) &&
        unescape(fact.label) === unescape(label)
    );

    if (!match) {
      problems.push(`${rel} [${id}]: no facts.md row "${sectionKey} › ${label}"`);
      continue;
    }

    checked += 1;

    if (match.retired) {
      problems.push(`${rel} [${id}]: facts.md row "${label}" is retired or disputed — do not publish it`);
    }

    if (match.confidence !== provenance) {
      problems.push(
        `${rel} [${id}]: provenance "${provenance}" but facts.md says "${match.confidence}"`
      );
    }

    const wanted = numbers(value);
    const have = numbers(match.value);
    const missing = wanted.filter((n) => !have.includes(n));
    if (wanted.length > 0 && missing.length > 0) {
      problems.push(
        `${rel} [${id}]: value "${value}" has number(s) ${missing.join(', ')} not in facts.md value "${match.value}"`
      );
    }
  }
}

if (problems.length > 0) {
  console.error(`\nFact verification failed (${problems.length}):\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error('\nEvery published number must match its corpus row. Fix the frontmatter,');
  console.error('or have the corpus updated first — the corpus is the source of truth.\n');
  process.exit(1);
}

console.log(`Fact verification passed: ${checked} corpus-cited metrics, ${skipped} sourced elsewhere.`);
