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
