-- Test migration to verify preview deployment pipeline
CREATE TABLE IF NOT EXISTS _preview_test (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
