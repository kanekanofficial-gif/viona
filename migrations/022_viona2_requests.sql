-- VIONA 2.0 separate non-payment music and careers requests
CREATE TABLE IF NOT EXISTS viona_music_requests (
 id UUID PRIMARY KEY,
 contact VARCHAR(200) NOT NULL,
 title VARCHAR(140) NOT NULL,
 genre VARCHAR(48) NOT NULL,
 voice VARCHAR(12) NOT NULL CHECK(voice IN ('female','male')),
 lyrics_mode VARCHAR(16) NOT NULL CHECK(lyrics_mode IN ('provided','commission')),
 lyrics_or_brief TEXT NOT NULL,
 mood VARCHAR(180) NOT NULL DEFAULT '',
 instrumentation VARCHAR(600) NOT NULL DEFAULT '',
 reference_note VARCHAR(600) NOT NULL DEFAULT '',
 status VARCHAR(24) NOT NULL DEFAULT 'new',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS viona_music_requests_created_idx ON viona_music_requests(created_at DESC);
CREATE TABLE IF NOT EXISTS viona_career_applications (
 id UUID PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 contact VARCHAR(200) NOT NULL,
 specialty VARCHAR(80) NOT NULL,
 skills TEXT NOT NULL,
 portfolio VARCHAR(500) NOT NULL DEFAULT '',
 availability VARCHAR(200) NOT NULL,
 status VARCHAR(24) NOT NULL DEFAULT 'new',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS viona_career_applications_created_idx ON viona_career_applications(created_at DESC);
