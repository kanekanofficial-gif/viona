-- VIONA order improvement: customer brief and reversible admin archiving.
-- No DELETE of bank transaction history, notifications or delivered files.
ALTER TABLE viona_demo_payments
 ADD COLUMN IF NOT EXISTS customer_contact TEXT NOT NULL DEFAULT '',
 ADD COLUMN IF NOT EXISTS customer_brief TEXT NOT NULL DEFAULT '',
 ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS viona_demo_payments_admin_archive_idx
 ON viona_demo_payments(archived_at,created_at DESC);
