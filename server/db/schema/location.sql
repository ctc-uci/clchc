CREATE TABLE IF NOT EXISTS location (
    id SERIAL PRIMARY KEY,
    location_id SERIAL,
    FOREIGN KEY (location_id)
        REFERENCES quota(location_id)
        ON DELETE CASCADE,
    tag_value VARCHAR(32) NOT NULL UNIQUE
);