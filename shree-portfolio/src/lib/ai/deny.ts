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
    // Technical payment operations, rates and packages are public engineering
    // topics. Match pay in personal compensation phrases rather than alone.
    pattern: /\b(salar(?:y|ies)|compensation|wages?|(?:expected|desired|base|annual|monthly|total|minimum|starting)\s+pay|pay\s+(?:range|expectations?|requirements?|package|you|him|shree)|pay\s+(?:do|does|would|should|can|will|is)\s+(?:you|he|shree)|(?:your|his|shree['’]s)\s+(?:(?:current|expected|desired|base|annual|monthly|total|minimum|starting)\s+)?pay|(?:hourly|daily|contract|consulting|freelance)\s+rates?|(?:benefits|employment|job|offer)\s+packages?|(?:your|his|shree['’]s)\s+(?:equity|rates?|packages?)\b(?!\s+(?:limit(?:ing|er|ers|s)?|manager|management|of)\b)|(?:get|receive)\s+(?:equity|stock options)|equity\s+(?:do you|does (?:he|shree))|how much (?:do|does|would|should) (?:you|he|shree) (?:make|earn|charge|get paid|be paid))\b|^(?:tell me about\s+|what(?: is|'s)\s+(?:the\s+)?)?pay[?.!]*$/i,
    reply:
      `Compensation isn't something I discuss on the site. Contact Shree directly — ${email}.`,
  },
  {
    // Refuse personal interview material, while allowing a project's weaknesses.
    pattern: /\b((?:your|his|shree['’]s)\s+(?:(?:biggest|greatest|main|personal)\s+)?(?:weakness(?:es)?|flaws?|worst trait)|(?:weakness(?:es)?|(?:biggest|greatest) flaw|worst trait)\s+(?:of|for)\s+(?:you|him|shree(?!['’]s\s))|weakness(?:es)?\s+(?:do|does)\s+(?:you|he|shree)\s+(?:have|show)|(?:personal|interview)\s+weakness(?:es)?)\b|^(?:tell me about\s+|what(?: is| are|'s)\s+(?:the\s+)?)?(?:(?:biggest|greatest)\s+)?weakness(?:es)?[?.!]*$/i,
    reply:
      `That's interview material rather than something the site documents. Ask Shree directly — ${email}. I can tell you about the projects and the decisions behind them.`,
  },
  {
    // A recorded role start date is public history, not future hiring availability.
    pattern: /\b(when can (?:you|he|shree) start|when (?:will|would|could) (?:you|he|shree) (?:be able to )?start|notice period|availability for interview|interview availability|when are you (?:free|available)|start date\s+(?:can|could|would|will)\s+(?:you|he|shree)|(?:earliest|available|possible|expected)\s+start date|start date\s+(?:for|at)\s+(?:(?:a|the)\s+new\s+(?:job|role|position)|our\s+(?:company|team|role|job))|(?:your|his|shree['’]s)\s+start date(?=\s*[?.!]*$))\b|^(?:what(?: is|'s)\s+(?:the\s+)?)?start date[?.!]*$/i,
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
