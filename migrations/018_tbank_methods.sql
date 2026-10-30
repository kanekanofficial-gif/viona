ALTER TABLE viona_demo_payments ADD COLUMN IF NOT EXISTS method TEXT NOT NULL DEFAULT 'card', ADD COLUMN IF NOT EXISTS save_card_requested BOOLEAN NOT NULL DEFAULT FALSE;
CREATE TABLE IF NOT EXISTS viona_demo_saved_cards (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), telegram_id TEXT NOT NULL, rebill_id TEXT NOT NULL, last4 CHAR(4) NOT NULL CHECK(last4 ~ '^[0-9]{4}$'), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(telegram_id,rebill_id));
CREATE INDEX IF NOT EXISTS viona_demo_saved_cards_owner_idx ON viona_demo_saved_cards(telegram_id,created_at DESC);
