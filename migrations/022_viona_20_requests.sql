-- VIONA 2.0: request queues. Never mark requests as paid without a bank-confirmed payment.
CREATE TABLE IF NOT EXISTS viona_music_requests (
 id UUID PRIMARY KEY,
 access_hash CHAR(64) NOT NULL,
 client_name VARCHAR(100) NOT NULL,
 contact VARCHAR(200) NOT NULL,
 track_title VARCHAR(120) NOT NULL,
 genre VARCHAR(40) NOT NULL,
 voice VARCHAR(10) NOT NULL CHECK (voice IN ('female','male')),
 text_mode VARCHAR(12) NOT NULL CHECK (text_mode IN ('own','artist')),
 lyrics_or_idea TEXT NOT NULL,
 mood VARCHAR(300) NOT NULL DEFAULT '',
 instruments VARCHAR(500) NOT NULL DEFAULT '',
 extra_notes TEXT NOT NULL DEFAULT '',
 status VARCHAR(24) NOT NULL DEFAULT 'new' CHECK (status IN ('new','review','accepted','in_progress','ready','declined')),
 quote_approved BOOLEAN NOT NULL DEFAULT FALSE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS viona_music_requests_latest ON viona_music_requests(created_at DESC);
CREATE TABLE IF NOT EXISTS viona_staff_applications (
 id UUID PRIMARY KEY,
 display_name VARCHAR(100) NOT NULL,
 contact VARCHAR(200) NOT NULL,
 role VARCHAR(32) NOT NULL,
 skills TEXT NOT NULL,
 portfolio VARCHAR(500) NOT NULL DEFAULT '',
 availability VARCHAR(180) NOT NULL,
 note TEXT NOT NULL DEFAULT '',
 status VARCHAR(24) NOT NULL DEFAULT 'new' CHECK(status IN ('new','review','invited','declined')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS viona_staff_applications_latest ON viona_staff_applications(created_at DESC);

CREATE TABLE IF NOT EXISTS viona_music_deliveries (
 request_id UUID PRIMARY KEY REFERENCES viona_music_requests(id) ON DELETE CASCADE,
 filename VARCHAR(180) NOT NULL,
 contents BYTEA NOT NULL,
 file_size INTEGER NOT NULL CHECK(file_size > 0 AND file_size <= 20971520),
 uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
