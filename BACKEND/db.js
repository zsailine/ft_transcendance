import Database from "better-sqlite3";

const db = new Database("./data/app.db");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
)
`);

console.log("✅ Base de données initialisée !");