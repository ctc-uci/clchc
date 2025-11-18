DROP TABLE IF EXISTS version_log CASCADE;

CREATE TYPE action AS ENUM (
    'increment', 'decrement'
);

CREATE TABLE IF NOT exists version_log (
    id SERIAL PRIMARY KEY,
    user_id INT,
    quota_id INT,
    action action NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quota_id) REFERENCES quota(id) ON DELETE CASCADE,
);