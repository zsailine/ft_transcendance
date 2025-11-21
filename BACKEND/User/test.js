import db from "./migration.js";
const stat =  db.prepare("SELECT * FROM matches \
	WHERE player1 = ? OR player2 = ? \
	ORDER BY played_at DESC \
	LIMIT ?").all("test0", "test0", 5);

	console.log(stat);

