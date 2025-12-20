import db from "./migration.js";
try {
	const sync = db.prepare(`
		INSERT INTO user_stats  (username, total_matches, total_wins, total_losses, total_duration, xp, returned, streak, max_streak, maxCombo)
		SELECT username, 0, 0, 0, 0, 0, 0, 0, 0, 0
		FROM users
		WHERE username NOT IN (SELECT username FROM user_stats)
	`);

	const result = sync.run();
	console.log(`${result.changes} nouveaux profils de stats créés.`);
} catch (err) {
	console.error("Erreur lors de la synchronisation :", err);
}