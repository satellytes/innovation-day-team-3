-- Add UUID extension for PostgreSQL if not using SQLite
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    stripe_customer_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
