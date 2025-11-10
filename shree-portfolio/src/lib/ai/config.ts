// AI Configuration
// This file contains placeholders for future AI integration

export const AI_CONFIG = {
  // Model settings
  model: 'gpt-4-turbo-preview', // or 'claude-3-opus'
  temperature: 0.7,
  maxTokens: 1000,
  
  // RAG settings
  embedding: {
    model: 'text-embedding-3-small',
    dimensions: 1536,
  },
  
  // Search settings
  retrieval: {
    topK: 5,
    minScore: 0.7,
    contextWindow: 2000,
  },
  
  // System prompt
  systemPrompt: `You are Shree's AI portfolio assistant. You help visitors learn about Shree's projects, experience, and skills.
  
  Guidelines:
  - Be concise but informative
  - Always cite sources when referencing specific projects or experiences
  - Use bullet points for clarity
  - Suggest relevant follow-up actions
  - If unsure, acknowledge it and suggest where to find more information
  
  You have access to:
  - Project details including metrics, technologies, and impact
  - Work experience with achievements and responsibilities
  - Education background and coursework
  - Technical skills and proficiencies`,
  
  // Response formatting
  formatting: {
    useBulletPoints: true,
    maxBullets: 5,
    includeNextActions: true,
    citeSources: true,
  },
};

// Placeholder for vector store configuration
export const VECTOR_STORE_CONFIG = {
  provider: 'pinecone', // or 'supabase', 'weaviate', etc.
  index: 'portfolio-content',
  namespace: 'production',
};

// Content preprocessing configuration
export const CONTENT_CONFIG = {
  chunking: {
    maxChunkSize: 500,
    overlap: 50,
  },
  
  metadata: {
    includeType: true,
    includeYear: true,
    includeCategory: true,
    includeTags: true,
  },
};

// Future integration checklist
export const INTEGRATION_CHECKLIST = [
  'Set up OpenAI/Claude API key',
  'Configure vector database',
  'Generate embeddings for all content',
  'Implement streaming responses',
  'Add conversation memory',
  'Set up rate limiting',
  'Implement caching layer',
  'Add error recovery',
  'Set up monitoring/logging',
  'Create fallback responses',
];
