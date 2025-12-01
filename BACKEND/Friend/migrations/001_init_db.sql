CREATE TABLE IF NOT EXISTS friendship (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_a TEXT NOT NULL,
    user_b TEXT NOT NULL,
	sender TEXT NOT NULL,
    blocked_by TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'declined', 'blocked')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	CHECK (user_a < user_b),
    UNIQUE (user_a, user_b)
)
