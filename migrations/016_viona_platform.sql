-- VIONA 16.0 PostgreSQL schema. Run once in the Render PostgreSQL database.
CREATE TABLE IF NOT EXISTS viona_users (
 telegram_id TEXT PRIMARY KEY,
 display_name VARCHAR(100) NOT NULL,
 username VARCHAR(100) NOT NULL DEFAULT '',
 photo_url TEXT,
 nickname VARCHAR(32) NOT NULL DEFAULT '',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS viona_orders (
 id UUID PRIMARY KEY,
 telegram_id TEXT NOT NULL REFERENCES viona_users(telegram_id) ON DELETE CASCADE,
 status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created','in_progress','ready','completed','cancelled')),
 items JSONB NOT NULL,
 total_rub INTEGER NOT NULL CHECK (total_rub >= 0),
 contact VARCHAR(200) NOT NULL,
 details TEXT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS viona_orders_owner_idx ON viona_orders(telegram_id,created_at DESC);
CREATE TABLE IF NOT EXISTS viona_notifications (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 telegram_id TEXT NOT NULL REFERENCES viona_users(telegram_id) ON DELETE CASCADE,
 order_id UUID REFERENCES viona_orders(id) ON DELETE CASCADE,
 message TEXT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 read_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS viona_notifications_owner_idx ON viona_notifications(telegram_id,created_at DESC);
CREATE OR REPLACE FUNCTION viona_order_notification() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP = 'INSERT' THEN
  INSERT INTO viona_notifications(telegram_id,order_id,message) VALUES(NEW.telegram_id,NEW.id,'Заявка на заказ создана · '||LEFT(NEW.id::text,8));
 ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
  INSERT INTO viona_notifications(telegram_id,order_id,message) VALUES(NEW.telegram_id,NEW.id,'Статус заказа: '||NEW.status);
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS viona_order_notify ON viona_orders;
CREATE TRIGGER viona_order_notify AFTER INSERT OR UPDATE OF status ON viona_orders FOR EACH ROW EXECUTE FUNCTION viona_order_notification();
