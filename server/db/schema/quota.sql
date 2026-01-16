DROP TABLE IF EXISTS quota;

CREATE TYPE appointment_type AS ENUM('inperson', 'telehealth');

CREATE TABLE IF NOT EXISTS quota (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    quota INTEGER NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    date DATE NOT NULL,
    start_time TIMESTAMP NOT NULL DEFAULT now(),
    end_time   TIMESTAMP NOT NULL DEFAULT now(),
    hours INTEGER GENERATED ALWAYS AS (
        FLOOR(
            (
                EXTRACT(EPOCH FROM (
                    CASE
                    WHEN end_time >= start_time
                        THEN (end_time - start_time)
                    ELSE (end_time - start_time) + INTERVAL '24 hours'
                    END
                )) / 3600.0
            )
        )::int
    ) STORED,
    appointment_type appointment_type NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (location_id) REFERENCES location(id) ON DELETE CASCADE
);
