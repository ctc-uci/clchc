DROP TABLE IF EXISTS users CASCADE;

CREATE TYPE role AS ENUM('master', 'ccm', 'ccs', 'viewer');
CREATE TYPE status AS ENUM('approved', 'pending', 'rejected');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firebase_uid TEXT NOT NULL UNIQUE,
  role role NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  status status NOT NULL,
  appt_calc_factor FLOAT
);
