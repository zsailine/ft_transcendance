CREATE TABLE IF NOT EXISTS friendship (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username_first TEXT NOT NULL,
    username_second TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'declined', 'blocked')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (username_first, username_second)
)
