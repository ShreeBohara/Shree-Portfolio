import { projects, experiences, personalInfo } from '@/data/portfolio';

const publicPaths = new Set([
  '/', '/about', '/browse', '/archive',
  personalInfo.links.resume.pdf,
  personalInfo.links.resume.html,
  ...projects.map(project => `/projects/${project.slug}`),
  ...projects.map(project => project.links.caseStudy).filter(link => link?.startsWith('/')),
  ...experiences.map(experience => `/experience/${experience.id}`),
]);

/** A literal approved site path must link to that path, even if the model
 * attaches another destination to its Markdown label. Other labels keep their
 * destination; this is a routing correction, not a claim-support guarantee. */
export function getChatLinkHref(label: string, href?: string): string | undefined {
  const path = label.trim();
  if (publicPaths.has(path)) return path;
  if (!href || href.trim() === '#') return undefined;
  return href;
}
