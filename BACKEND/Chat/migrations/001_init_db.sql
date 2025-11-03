CREATE TABLE IF NOT EXISTS message (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receiver_username TEXT NOT NULL,
    sender_username TEXT NOT NULL,
    text TEXT,
	image TEXT
)
