CREATE TYPE appointment_type enum('inperson', 'telehealth'),

DROP TABLE IF EXISTS quota;
CREATE TABLE IF NOT EXISTS quota (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER NOT NULL,
    FOREIGN KEY (location_id)
        REFERENCES location(id)
        ON DELETE CASCADE
    quota INTEGER NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    hours INTEGER NOT NULL, 
    appointment_type appointment_type NOT NULL,
    notes TEXT,
);