import db from "./migration.js";

const stmt = db.prepare("DELETE FROM matches WHERE player1 = ?")
const result = stmt.run("test0");

