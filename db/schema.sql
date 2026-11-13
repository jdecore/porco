-- Feedback de visitantes de Porco.
-- Ejecutar con: npm run db:init
CREATE TABLE IF NOT EXISTS porco_feedback (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  improve_tags TEXT[] NOT NULL DEFAULT '{}',
  improve_text TEXT,
  collaboration TEXT NOT NULL CHECK (collaboration IN ('si', 'tal_vez', 'no')),
  role TEXT,
  email TEXT,
  name TEXT,
  page TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  ip_hash TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS porco_feedback_created_at_idx
  ON porco_feedback (created_at DESC);

CREATE INDEX IF NOT EXISTS porco_feedback_rating_idx
  ON porco_feedback (rating);

-- Base vectorial para documentación Markdown (EmbeddingGemma 2: 768 dimensiones).
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS porco_docs_chunks (
  id BIGSERIAL PRIMARY KEY,
  archivo TEXT NOT NULL,
  ruta_seccion TEXT NOT NULL,
  contenido TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  embedding vector(768),
  tsv tsvector GENERATED ALWAYS AS (to_tsvector('spanish', contenido)) STORED,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS porco_docs_embedding_idx
  ON porco_docs_chunks USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS porco_docs_tsv_idx
  ON porco_docs_chunks USING gin (tsv);

CREATE UNIQUE INDEX IF NOT EXISTS porco_docs_unique_chunk_idx
  ON porco_docs_chunks (archivo, ruta_seccion, content_hash);
