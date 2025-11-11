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
    prompt += `[Note: The visitor is currently viewing this ${context.itemType} on Shree's portfolio, so they're particularly interested in learning more about it.]\n\n`;
  }

  // Add retrieved portfolio information
  if (retrievedChunks.length > 0) {
    prompt += `Here's relevant information from Shree's portfolio:\n\n`;
    prompt += `---\n\n`;
    prompt += formatChunksForContext(retrievedChunks);
    prompt += `\n---\n\n`;
  } else {
    // No chunks found - be helpful anyway
    prompt += `[No specific portfolio content was retrieved for this query, but you can still provide a helpful response based on what you know about Shree from the system prompt. If it's a general question, answer it briefly and connect to Shree's work. If it's about something specific that's not in the portfolio, suggest booking a call.]\n\n`;
  }

  // Add the user's question
  prompt += `Visitor's Question: "${query}"\n\n`;

  // Provide helpful instructions (not strict rules)
  prompt += `Response Guidelines:\n`;
  prompt += `• Keep it SHORT (2-4 paragraphs max) - get to the point quickly\n`;
  prompt += `• Lead with key facts: metrics, technologies, impact\n`;
  prompt += `• Tell stories briefly (1-2 sentences per story)\n`;
  prompt += `• Use 3-4 bullet points max when listing\n`;
  prompt += `• If salary/availability comes up, suggest booking a call\n`;
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

