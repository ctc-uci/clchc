DROP TABLE IF EXISTS public.users CASCADE;
CREATE TYPE roles AS ENUM('master', 'ccm', 'ccs', 'viewer');
CREATE TYPE statusType AS ENUM('approved', 'pending', 'rejected');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL,
  role roles NOT NULL,
  first_name VARCHAR(16) NOT NULL,
  last_name VARCHAR(16) NOT NULL,
  email VARCHAR(32) NOT NULL,
  status statusType  NOT NULL,
  appt_calc_factor FLOAT,
);
