CREATE TABLE IF NOT EXISTS quota (
    id SERIAL PRIMARY KEY,
    quota_id INT,
    FOREIGN KEY (quota_id)
        REFERENCES version_log(quota_id)
        ON DELETE CASCADE,

    provider_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    quota INTEGER NOT NULL,
    progress INTEGER NOT NULL,
    hours INTEGER NOT NULL, 
    appointment_type appointment_type NOT NULL,
    notes VARCHAR(256),
<<<<<<< HEAD

=======
    
>>>>>>> 5b73a6aceb5a75fd37a4a5f147944305407c19bd
    CREATE TYPE appointment_type enum('inperson', 'telehealth'),
);