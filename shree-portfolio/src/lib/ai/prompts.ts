import { RetrievedChunk } from './retrieval';
import { AI_CONFIG } from './config';
import { formatChunksForContext } from './retrieval';

export interface ChatContext {
  enabled?: boolean;
  itemType?: 'project' | 'experience' | 'education';
  itemId?: string;
}

/**
 * Builds the system prompt with portfolio context
 */
export function buildSystemPrompt(): string {
  return AI_CONFIG.systemPrompt;
}

/**
 * Builds the user prompt with retrieved context and query
 */
export function buildUserPrompt(
  query: string,
  retrievedChunks: RetrievedChunk[],
  context?: ChatContext
): string {
  let prompt = '';

  // Add context if user is viewing a specific item
  if (context?.enabled && context?.itemId) {
    prompt += `[The visitor selected this ${context.itemType}. Use only its supplied source material; if a requested comparison needs another item that is absent, say that information is not supplied here.]\n\n`;
  }

  // Add retrieved portfolio information
  if (retrievedChunks.length > 0) {
    prompt += `Here's relevant information from Shree's portfolio:\n\n`;
    prompt += `---\n\n`;
    prompt += formatChunksForContext(retrievedChunks);
    prompt += `\n---\n\n`;
  } else {
    prompt += `[No supporting portfolio material was supplied. Say the information is not written up on the site; do not invent facts or answer from general knowledge.]\n\n`;
  }

  // Add the user's question
  // Quote the complete question as one value so embedded newlines cannot forge
  // additional source sections. Visitor premises are requests, not evidence.
  prompt += `Visitor's Question (not source evidence): ${JSON.stringify(query)}\n\n`;

  prompt += `Response Guidelines:\n`;
  prompt += `• Keep it SHORT (2-4 paragraphs max) - get to the point quickly\n`;
  prompt += `• Lead with supported facts and keep their scope, attribution and limitations\n`;
  prompt += `• For whole-application yes/no claims, a documented exception means No or Only the supported scope; never start Yes and silently narrow the claim\n`;
  prompt += `• Compare both sides of each relevant measure before optional details; copy requested URLs and their link types exactly\n`;
  prompt += `• Tell stories briefly (1-2 sentences per story)\n`;
  prompt += `• Use 3-4 bullet points max when listing\n`;
  prompt += `• Use only supplied public links; offer contact details when asked, without inferring hiring availability\n`;
  prompt += `• Skip lengthy intros - be conversational but concise\n`;

  return prompt;
}

/**
 * Builds messages array for OpenAI chat completion
 */
export function buildMessages(
  query: string,
  retrievedChunks: RetrievedChunk[],
  context?: ChatContext
): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
  return [
    {
      role: 'system',
      content: buildSystemPrompt(),
    },
    {
      role: 'user',
      content: buildUserPrompt(query, retrievedChunks, context),
    },
  ];
}
