DROP TABLE IF EXISTS version_log CASCADE;

CREATE TYPE action AS ENUM (
    'increment', 'decrement'
);

CREATE TABLE IF NOT EXISTS version_log (
    id SERIAL PRIMARY KEY,
    user_id INT,
    quota_id INT,
    action action NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quota_id) REFERENCES quota(id) ON DELETE CASCADE
);

ALTER TABLE version_log
ADD COLUMN delta INT;

CREATE FUNCTION log_quota_progress_change()
RETURNS TRIGGER AS $$
BEGIN
    -- check if the specific column changed
    IF OLD.progress IS DISTINCT FROM NEW.progress THEN
        INSERT INTO version_log (
            user_id,
            quota_id,
            action,
            delta
        )
        VALUES (
            NEW.user_id,
            NEW.id,
            CASE
                WHEN NEW.progress > OLD.progress THEN 'increment'::action
                ELSE 'decrement'::action
            END,
            NEW.progress-OLD.progress
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quota_progress_change_trigger
AFTER UPDATE OF progress
ON quota
FOR EACH ROW
EXECUTE FUNCTION log_quota_progress_change();