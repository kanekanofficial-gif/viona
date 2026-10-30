-- VIONA 17: payment snapshot, verified fulfillment state and actual team updates.
-- Never infer a confirmed payment from the bank's return URL.
ALTER TABLE viona_demo_payments
 ADD COLUMN IF NOT EXISTS items JSONB NOT NULL DEFAULT '[]'::jsonb,
 ADD COLUMN IF NOT EXISTS fulfillment_status TEXT NOT NULL DEFAULT 'awaiting_payment',
 ADD COLUMN IF NOT EXISTS fulfillment_note TEXT NOT NULL DEFAULT '',
 ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
 ADD COLUMN IF NOT EXISTS last_bank_check_at TIMESTAMPTZ,
 ADD COLUMN IF NOT EXISTS stage_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE TABLE IF NOT EXISTS viona_demo_order_events (
 id BIGSERIAL PRIMARY KEY,
 order_id UUID NOT NULL REFERENCES viona_demo_payments(order_id) ON DELETE CASCADE,
 stage TEXT NOT NULL,
 message TEXT NOT NULL DEFAULT '',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS viona_demo_order_events_order_idx
 ON viona_demo_order_events(order_id,id DESC);

-- Restrict newly recorded statuses without modifying historic payment entries.
CREATE INDEX IF NOT EXISTS viona_demo_payment_confirmed_idx
 ON viona_demo_payments(telegram_id,created_at DESC);
