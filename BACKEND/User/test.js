import db from "./migration.js";

const stmt = db.prepare("DELETE FROM matches WHERE player1_id = ?")
const result = stmt.run(1);

