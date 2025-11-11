-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create portfolio_embeddings table
CREATE TABLE IF NOT EXISTS portfolio_embeddings (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS portfolio_embeddings_embedding_idx 
ON portfolio_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index for metadata filtering
CREATE INDEX IF NOT EXISTS portfolio_embeddings_metadata_idx 
ON portfolio_embeddings 
USING GIN (metadata);

-- Create function for similarity search
CREATE OR REPLACE FUNCTION match_portfolio_embeddings(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.6,
  match_count int DEFAULT 7
)
RETURNS TABLE (
  id TEXT,
  content TEXT,
  metadata JSONB,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    portfolio_embeddings.id,
    portfolio_embeddings.content,
    portfolio_embeddings.metadata,
    1 - (portfolio_embeddings.embedding <=> query_embedding) AS similarity
  FROM portfolio_embeddings
  WHERE 1 - (portfolio_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY portfolio_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_portfolio_embeddings_updated_at
BEFORE UPDATE ON portfolio_embeddings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

