CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || 
        substr(lower(hex(randomblob(2))),2) || '-' || 
        substr('89ab',abs(random()) % 4 + 1, 1) ||
        substr(lower(hex(randomblob(2))),2) || '-' || 
        lower(hex(randomblob(6)))),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    stripe_price_id TEXT NOT NULL,
    status TEXT NOT NULL,
    current_period_start TEXT NOT NULL,
    current_period_end TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
