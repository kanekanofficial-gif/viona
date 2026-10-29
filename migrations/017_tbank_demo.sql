CREATE TABLE IF NOT EXISTS viona_demo_payments (
 order_id UUID PRIMARY KEY,
 telegram_id TEXT NOT NULL,
 amount_kopecks BIGINT NOT NULL CHECK(amount_kopecks>0),
 payment_id TEXT,
 status TEXT NOT NULL DEFAULT 'NEW',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS viona_demo_payments_user_idx ON viona_demo_payments(telegram_id,created_at DESC);
