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

const getLeaderboard = async (req, rep) => {
	try {
		const stmt = db.prepare(`
            SELECT
                username, 
                xp,
                CAST(total_wins AS FLOAT) / total_matches as win_rate,
                DENSE_RANK() OVER (ORDER BY xp DESC) as rank
            FROM user_stats 
            ORDER BY rank ASC
            LIMIT 100
        `);

		const leaderboard = stmt.all();
		rep.send(leaderboard);

	} catch (err) {
		rep.code(500).send(err);
	}
}

const getPlayerRank = async (req, rep) => {
	const { username } = req.params;

	try {
		const stmt = db.prepare(`
            WITH RankedPlayers AS (
                SELECT 
                    username, 
                    xp, 
                    total_wins,
                    ROW_NUMBER() OVER (ORDER BY xp DESC, total_wins DESC, username ASC) as row_num
                FROM user_stats
            )
            SELECT 
                username, 
                xp, 
                total_wins,
                DENSE_RANK() OVER (ORDER BY xp DESC) as display_rank
            FROM RankedPlayers
            WHERE row_num BETWEEN 
                (SELECT row_num - 1 FROM RankedPlayers WHERE username = ?) 
                AND 
                (SELECT row_num + 1 FROM RankedPlayers WHERE username = ?)
            ORDER BY row_num ASC
        `);

		const neighbors = stmt.all(username, username);

		if (neighbors.length === 0) {
			return rep.code(404).send({ error: "Player not found" });
		}

		rep.send(neighbors);
	} catch (err) {
		console.error(err);
		rep.code(500).send({ error: "Erreur serveur" });
	}
}

const addMatch = async (req, rep) => {
	const { player1, player2, winner, score_p1, score_p2, duration } = req.body;
	const loser = (winner === player1) ? player2 : player1;

	const insertMatch = db.prepare("INSERT into matches (player1, player2, winner, score_p1, score_p2, duration) VALUES (?, ?, ?, ?, ?, ?)");
	const updateWinner = db.prepare(`
        INSERT INTO user_stats (username, total_matches, total_wins, total_losses, total_duration, xp)
        VALUES (?, 1, 1, 0, ?, 10) 
        ON CONFLICT(username) DO UPDATE SET
            total_matches = total_matches + 1,
            total_wins = total_wins + 1,
            total_duration = total_duration + ?,
            xp = xp + 10
    `);

	const updateLoser = db.prepare(`
        INSERT INTO user_stats (username, total_matches, total_wins, total_losses, total_duration, xp)
        VALUES (?, 1, 0, 1, ?, 0)
        ON CONFLICT(username) DO UPDATE SET
            total_matches = total_matches + 1,
            total_losses = total_losses + 1,
            total_duration = total_duration + ?,
            xp = MAX(0, xp - 10)
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

export { addMatch, getuserMatches, getStats, getLeaderboard, getPlayerRank }