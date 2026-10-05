import { personalInfo } from '@/data/portfolio';

/**
 * Topics the assistant must not answer, checked before any model call.
 *
 * These are things a public portfolio should not discuss on Shree's behalf:
 * work authorisation, compensation, interview logistics, and the
 * interview-prep material ("biggest weakness") that used to be served verbatim
 * to anyone who asked. Handling them here means no tokens are spent and no
 * model gets the chance to improvise.
 */

const email = personalInfo.links.email;

const DENY_PATTERNS: { pattern: RegExp; reply: string }[] = [
  {
    pattern: /\b(visa|h-?1b|opt|cpt|stem opt|sponsorship|sponsor|green card|(?:work|employment)\s+authori[sz](?:ation|ations|ed|e|ing)?|authori[sz](?:ation|ed)\s+to\s+work|citizenship|immigration)\b/i,
    reply:
      `I don't cover work authorisation or immigration questions here. Contact Shree directly — ${email}.`,
  },
  {
    // "Rate" and "package" also describe engineering work. Match them in
    // compensation phrases without blocking rate limiting or package managers.
    pattern: /\b(salar(?:y|ies)|compensation|pay|wages?|(?:hourly|daily|contract|consulting|freelance)\s+rates?|(?:benefits|employment|job|offer)\s+packages?|(?:your|his|shree['’]s)\s+(?:equity|rates?|packages?)\b(?!\s+(?:limit(?:ing|er|ers|s)?|manager|management|of)\b)|(?:get|receive)\s+(?:equity|stock options)|equity\s+(?:do you|does (?:he|shree))|how much (?:do|does|would) (?:you|he|shree) (?:make|earn|charge)|expected pay)\b/i,
    reply:
      `Compensation isn't something I discuss on the site. Contact Shree directly — ${email}.`,
  },
  {
    pattern: /\b(weakness|biggest flaw|worst trait|greatest weakness)\b/i,
    reply:
      `That's interview material rather than something the site documents. Ask Shree directly — ${email}. I can tell you about the projects and the decisions behind them.`,
  },
  {
    pattern: /\b(start date|when can (you|he) start|notice period|availability for interview|interview availability|when are you (free|available))\b/i,
    // Public contact information does not establish hiring availability. Keep
    // timing and scheduling with Shree rather than asserting a job-search status.
    reply:
      `Timing and scheduling go through Shree directly. You can reach him at ${email}.`,
  },
  {
    pattern: /\b(gpa|grade point|phone number|home address|where do you live)\b/i,
    reply:
      `That isn't published on the site. Email is the way to reach Shree — ${email}.`,
  },
];

export function checkDenyList(query: string): string | null {
  for (const { pattern, reply } of DENY_PATTERNS) {
    if (pattern.test(query)) return reply;
  }
  return null;
}
