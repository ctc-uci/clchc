DROP TABLE IF EXISTS public.users CASCADE;
CREATE TYPE roles AS ENUM('master', 'ccm', 'ccs', 'viewer');
CREATE TYPE statusType AS ENUM('approved', 'pending', 'rejected');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firebase_uid TEXT NOT NULL UNIQUE,
  role roles NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  status statusType  NOT NULL,
  appt_calc_factor FLOAT
);
