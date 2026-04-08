-- Migration 0001: initial schema

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'client', -- 'admin' | 'client'
  name TEXT,
  stripe_customer_id TEXT,
  invite_token TEXT,
  invite_expires_at TEXT,
  reset_token TEXT,
  reset_expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE sites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT,
  -- CMS integration: siteId used as KV key prefix for content:{cms_site_id}:{page}
  cms_site_id TEXT NOT NULL UNIQUE,
  cms_passphrase TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'spark', -- 'spark' | 'blaze' | 'inferno'
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  stripe_quote_id TEXT,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress' | 'active' | 'paused' | 'cancelled'
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_sites_user_id ON sites(user_id);
CREATE INDEX idx_sites_cms_site_id ON sites(cms_site_id);
CREATE INDEX idx_sites_stripe_subscription_id ON sites(stripe_subscription_id);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
