DROP TABLE IF EXISTS providers CASCADE;

CREATE TABLE IF NOT EXISTS providers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    degree VARCHAR(6),
    license TEXT NOT NULL DEFAULT '',
    phone_number TEXT,
    dea TEXT,
    data JSONB NOT NULL,
    notes TEXT NOT NULL DEFAULT ''
);