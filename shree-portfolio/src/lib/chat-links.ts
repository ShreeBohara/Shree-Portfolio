import { projects, experiences, personalInfo } from '@/data/portfolio';

const publicPaths = new Set([
  '/', '/about', '/browse', '/archive',
  personalInfo.links.resume.pdf,
  personalInfo.links.resume.html,
  ...projects.map(project => `/projects/${project.slug}`),
  ...projects.map(project => project.links.caseStudy).filter(link => link?.startsWith('/')),
  ...experiences.map(experience => `/experience/${experience.id}`),
]);

const destinationLabels = new Map<string, string>();
for (const project of projects) {
  destinationLabels.set(`/projects/${project.slug}`, 'project page');
  if (project.links.github) destinationLabels.set(project.links.github, 'source repository');
  if (project.links.caseStudy) destinationLabels.set(project.links.caseStudy, 'engineering write-up');
  if (project.links.video) destinationLabels.set(project.links.video, 'video');
}
for (const experience of experiences) {
  destinationLabels.set(`/experience/${experience.id}`, 'experience page');
  if (experience.links?.company) destinationLabels.set(experience.links.company, 'company website');
  if (experience.links?.project) destinationLabels.set(experience.links.project, 'product page');
}

export function getChatLinkLabel(label: string, href?: string): string {
  const generic = /^(?:the\s+)?(?:project page|experience page|product page|company website|case study(?:\s*\/\s*engineering write-up)?|engineering write-up|write-up|source repository|source code|repository|video)$/i;
  return href && generic.test(label.trim()) ? destinationLabels.get(href) ?? label : label;
}

/** A literal approved site path must link to that path, even if the model
 * attaches another destination to its Markdown label. Other labels keep their
 * destination; this is a routing correction, not a claim-support guarantee. */
export function getChatLinkHref(label: string, href?: string): string | undefined {
  const path = label.trim();
  if (publicPaths.has(path)) return path;
  if (!href || href.trim() === '#') return undefined;
  return href;
}
