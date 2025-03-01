-- Add migration script here
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    project_ids INT[] DEFAULT '{}',  -- Store multiple project IDs as an array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
