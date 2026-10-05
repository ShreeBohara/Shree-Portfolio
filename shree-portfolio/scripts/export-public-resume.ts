/** A curated résumé projection of the public site data; no private corpus imports. */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { personalInfo, experiences, education, projects } from '../src/data/portfolio';
import { contentUpdatedAt } from '../src/data/site';

const selectedIds = ['project-faultlab', 'project-trading', 'project-codebaseqa'];
const selectedProjects = selectedIds.map(id => {
  const project = projects.find(item => item.id === id);
  if (!project) throw new Error(`Missing résumé project: ${id}`);
  return {
    title: project.title,
    duration: project.duration,
    summary: project.summary,
    // Use an existing public artifact while the site update awaits publication.
    url: project.links.github
      || (project.links.caseStudy?.startsWith('https://') ? project.links.caseStudy : undefined)
      || `https://shreebohara.com/projects/${project.slug}`,
  };
});

const document = {
  updated: contentUpdatedAt,
  name: personalInfo.name,
  title: personalInfo.title,
  location: personalInfo.location,
  summary: personalInfo.tagline,
  contacts: [
    { text: personalInfo.links.email, url: `mailto:${personalInfo.links.email}` },
    { text: 'shreebohara.com', url: 'https://shreebohara.com' },
    { text: 'GitHub', url: personalInfo.links.github },
    { text: 'LinkedIn', url: personalInfo.links.linkedin },
  ],
  experiences: experiences.map(item => ({
    company: item.company,
    role: item.role,
    type: item.type,
    location: item.location,
    start: item.startDate,
    end: item.endDate,
    // Longer narratives remain on the website; every selected bullet is public.
    highlights: item.highlights.slice(0, 2).map(highlight => highlight.text),
  })),
  projects: selectedProjects,
  education: education.map(item => ({
    institution: item.institution,
    degree: `${item.degree}, ${item.field}`,
    completion: item.achievements?.find(line => line.startsWith('Completed')) || String(item.endYear),
  })),
  skills: personalInfo.skills
    .filter(group => ['Languages', 'Backend', 'Frontend', 'AI & LLM', 'Data', 'Testing'].includes(group.category))
    .map(group => ({ category: group.category, items: group.items.slice(0, 5) })),
  awards: personalInfo.faqs?.find(faq => faq.question === 'Have you built projects at hackathons?')?.answer.split(' FaultLab')[0] || '',
};

const json = JSON.stringify(document, null, 2) + '\n';
const hash = createHash('sha256').update(json).digest('hex');
const source = resolve('docs/public-resume.json');

if (process.argv.includes('--check')) {
  const artifacts = [source, resolve('public/resume.html'), resolve('public/Shree_Bohara_Resume.pdf')];
  const missing = artifacts.filter(path => !existsSync(path));
  const sourceChanged = !existsSync(source) || readFileSync(source, 'utf8') !== json;
  const outputsStale = artifacts.slice(1).filter(path => existsSync(path) && !readFileSync(path).includes(Buffer.from(hash)));
  if (missing.length || sourceChanged || outputsStale.length) {
    console.error('Public résumé is out of sync. Run npm run resume:content, then the documented PDF builder.');
    for (const path of [...missing, ...outputsStale]) console.error(path);
    process.exitCode = 1;
  } else {
    console.log('Public résumé source, HTML and PDF match the current public data.');
  }
} else {
  writeFileSync(source, json);
  console.log(`Wrote ${source}; source SHA-256 ${hash}`);
}
