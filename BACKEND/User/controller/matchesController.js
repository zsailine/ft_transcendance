import db from "../migration.js";

const getuserMatches = (req, rep) => {
	try {
		const { username } = req.params;
		
		if (!username) {
			return rep.status(400).send({ error: 'Username requis' });
		}
		
		const page = Math.max(1, parseInt(req.query.page) || 1);
		const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
		const offset = (page - 1) * limit;

		const resCount = db.prepare(
			"SELECT COUNT(*) as count FROM matches WHERE player1 = ? OR player2 = ?"
		).get(username, username);
		
		const totalMatches = resCount.count;
		const totalPages = Math.ceil(totalMatches / limit);

		const matches = db.prepare(
			"SELECT * FROM matches WHERE player1 = ? OR player2 = ? ORDER BY played_at DESC LIMIT ? OFFSET ?"
		).all(username, username, limit, offset);
		
		rep.send({ 
			data: matches,
			pagination: {
				total: totalMatches,
				totalPages,
				currentPage: page,
				limit,
				hasNext: page < totalPages,
				hasPrevious: page > 1
			}
		});
		
	} catch (error) {
		console.error('Erreur getUserMatches:', error);
		rep.status(500).send({ error: 'Erreur serveur' });
	}
}

const getStats = (req, rep) => {
	const { username } = req.params;
	const stat = db.prepare("SELECT * FROM user_stats \
        WHERE username = ? ").get(username);
	rep.send(stat);
}

const addMatch = async (req, rep) => {
	const { player1, player2, winner, score_p1, score_p2 } = req.body;
	const loser = (winner === player1) ? player2 : player1;
	const insertMatch = db.prepare("INSERT into matches (player1, player2, winner, score_p1, score_p2) VALUES (?, ?, ?, ?, ?)");

	const updateWinner = db.prepare(`
        INSERT INTO user_stats (username, total_matches, total_wins, total_losses)
        VALUES (?, 1, 1, 0)
        ON CONFLICT(username) DO UPDATE SET
            total_matches = total_matches + 1,
            total_wins = total_wins + 1
    `);

	const updateLoser = db.prepare(`
        INSERT INTO user_stats (username, total_matches, total_wins, total_losses)
        VALUES (?, 1, 0, 1)
        ON CONFLICT(username) DO UPDATE SET
            total_matches = total_matches + 1,
            total_losses = total_losses + 1
    `);

	const transaction = db.transaction(() => {
		insertMatch.run(player1, player2, winner, score_p1, score_p2);
		updateWinner.run(winner);
		updateLoser.run(loser);
	});

	try {
		transaction();
	} catch (err) {
		rep.code(400).send(err);
	}
}

export { addMatch, getuserMatches, getStats }