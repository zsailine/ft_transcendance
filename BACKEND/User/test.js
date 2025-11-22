import db from "./migration.js";
db.prepare("DROP TABLE IF EXISTS user_stats").run();
db.prepare(`
 CREATE TABLE IF NOT EXISTS user_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT UNIQUE NOT NULL,
    total_matches INTEGER DEFAULT 0,
    total_wins INTEGER DEFAULT 0,
    total_losses INTEGER DEFAULT 0,

    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
)
`).run();


