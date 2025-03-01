-- Add migration script here

-- Projects Table (A project has multiple items)
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (Each user can be linked to a project)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    project_id INT REFERENCES projects(id) ON DELETE SET NULL,  -- If project is deleted, set NULL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items Table (Each item is linked to a project)
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,  -- If project is deleted, delete all its items
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    frequency INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
