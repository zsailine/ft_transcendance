CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1 TEXT NOT NULL,
    player2 TEXT,
    winner TEXT,
    score_p1 INTEGER DEFAULT 0,
    score_p2 INTEGER DEFAULT 0,
    duration INTEGER,
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (player1) REFERENCES users(username),
    FOREIGN KEY (player2) REFERENCES users(username),
    FOREIGN KEY (winner) REFERENCES users(username)
);