/**
 * Topics the assistant must not answer, checked before any model call.
 *
 * These are things a public portfolio should not discuss on Shree's behalf:
 * work authorisation, compensation, interview logistics, and the
 * interview-prep material ("biggest weakness") that used to be served verbatim
 * to anyone who asked. Handling them here means no tokens are spent and no
 * model gets the chance to improvise.
 */

const DENY_PATTERNS: { pattern: RegExp; reply: string }[] = [
  {
    pattern: /\b(visa|h-?1b|opt|cpt|stem opt|sponsorship|sponsor|green card|work authoriz|work authoris|citizenship|immigration)\b/i,
    reply:
      "I don't cover work authorisation or immigration questions here. Shree is happy to talk about it directly — shreetbohara@gmail.com.",
  },
  {
    pattern: /\b(salary|compensation|pay|rate|wage|equity|package|how much (do|does|would) (you|he) (make|earn|charge)|expected pay)\b/i,
    reply:
      "Compensation isn't something I discuss on the site. Shree would rather have that conversation directly — shreetbohara@gmail.com.",
  },
  {
    pattern: /\b(weakness|biggest flaw|worst trait|greatest weakness)\b/i,
    reply:
      "That's interview material rather than something the site documents. If you want the honest version, ask Shree — shreetbohara@gmail.com. I can tell you about the projects, the decisions behind them, and what he'd change.",
  },
  {
    pattern: /\b(start date|when can (you|he) start|notice period|availability for interview|interview availability|when are you (free|available))\b/i,
    // Answer the question behind the question first: someone asking "when can he
    // start" wants his status. The status is corpus-backed; the scheduling half
    // is the part that goes to email.
    reply:
      "Shree is a Software Engineer at QuinStreet in San Francisco and isn't on the market, but he's always open to a conversation about AI infrastructure, agent systems, or production reliability. Timing and scheduling go through him directly — shreetbohara@gmail.com.",
  },
  {
    pattern: /\b(gpa|grade point|phone number|home address|where do you live)\b/i,
    reply:
      "That isn't published on the site. Email is the way to reach Shree — shreetbohara@gmail.com.",
  },
];

export function checkDenyList(query: string): string | null {
  for (const { pattern, reply } of DENY_PATTERNS) {
    if (pattern.test(query)) return reply;
  }
  return null;
}
