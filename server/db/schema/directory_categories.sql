DROP TABLE IF EXISTS directory_categories CASCADE;

CREATE TYPE input_type AS ENUM('tag', 'text');

CREATE TABLE directory_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    input_type input_type NOT NULL,
    is_required BOOLEAN NOT NULL,
    date_created TIMESTAMP DEFAULT NOW(),
    column_order INT
);