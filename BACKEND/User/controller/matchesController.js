import db from "../migration.js";

const getuserMatches = (req, rep) => {
	const { username } = req.params;
	const { size } = req.query;
	const requestedLimit = parseInt(size);
    const limit = (requestedLimit > 0) ? requestedLimit : 1000000
	const matches = db.prepare("SELECT * FROM matches \
        WHERE player1 = ? OR player2 = ? \
        ORDER BY played_at DESC \
		LIMIT ?").all(username, username, limit);
	rep.send(matches);
}

const getStats = (req, rep) => {
	const { username } = req.params;
	const stat = db.prepare("SELECT * FROM user_stats \
        WHERE username = ? ").get(username);
	rep.send(stat);
}

const addMatch = async (req, rep) => {
	const { player1, player2, winner, score_p1, score_p2, duration } = req.body;
	const loser = (winner === player1) ? player2 : player1;
	const insertMatch = db.prepare("INSERT into matches (player1, player2, winner, score_p1, score_p2, duration) VALUES (?, ?, ?, ?, ?, ?)");

	const updateWinner = db.prepare(`
        INSERT INTO user_stats (username, total_matches, total_wins, total_losses, total_duration)
        VALUES (?, 1, 1, 0, ?)
        ON CONFLICT(username) DO UPDATE SET
            total_matches = total_matches + 1,
            total_wins = total_wins + 1,
			total_duration = total_duration + ?
    `);

	const updateLoser = db.prepare(`
        INSERT INTO user_stats (username, total_matches, total_wins, total_losses, total_duration)
        VALUES (?, 1, 1, 0, ?)
        ON CONFLICT(username) DO UPDATE SET
            total_matches = total_matches + 1,
            total_losses = total_losses + 1,
			total_duration = total_duration + ?
    `);

	const transaction = db.transaction(() => {
		insertMatch.run(player1, player2, winner, score_p1, score_p2, duration);
		updateWinner.run(winner, duration, duration);
		updateLoser.run(loser, duration, duration);
	});

	try {
		transaction();
	} catch (err) {
		rep.code(400).send(err);
	}
}

export { addMatch, getuserMatches, getStats }