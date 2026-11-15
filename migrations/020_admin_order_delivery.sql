-- VIONA: admin sessions and private delivery of verified demo orders.
-- Sessions store only hashes of opaque tokens; files never live in /public.
CREATE TABLE IF NOT EXISTS viona_admin_sessions (
 token_hash CHAR(64) PRIMARY KEY,
 google_sub VARCHAR(255) NOT NULL,
 expires_at TIMESTAMPTZ NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS viona_admin_sessions_expiry_idx ON viona_admin_sessions(expires_at);
CREATE TABLE IF NOT EXISTS viona_demo_order_files (
 order_id UUID PRIMARY KEY REFERENCES viona_demo_payments(order_id) ON DELETE CASCADE,
 filename VARCHAR(180) NOT NULL,
 media_type VARCHAR(70) NOT NULL DEFAULT 'application/octet-stream',
 contents BYTEA NOT NULL,
 file_size INTEGER NOT NULL CHECK(file_size > 0 AND file_size <= 1048576),
 uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
