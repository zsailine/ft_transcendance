import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const db = new Database("./data/auth.db");

db.exec(`
CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

const migrationDir = "./migrations";
const appliedMigrations = db.prepare("SELECT name FROM migrations").all().map(m => m.name);

const files = fs.readdirSync(migrationDir).filter(file => file.endsWith(".sql"));
files.sort();

for (const file of files) {
  if (appliedMigrations.includes(file))
  {
    console.log(`Migration applied yet: ${file}`);
    continue;
  }

  const filePath = path.join(migrationDir, file);
  const sql = fs.readFileSync(filePath, "utf-8");
  try {
    console.log(`Applying migration: ${file}`);
    db.exec("BEGIN");
    db.exec(sql);
    db.prepare("INSERT INTO migrations (name) VALUES (?)").run(file);
    db.exec("COMMIT");
    console.log(`Migration applied: ${file}`);
  } catch (e) {
    db.exec("ROLLBACK");
    console.error(`Failed to apply migration: ${file}`, e);
    process.exit(1);
  }
}

export default db;
