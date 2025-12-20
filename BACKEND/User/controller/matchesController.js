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
    if (!matches)
        return rep.code(404).send({ error: "User not found" });
    rep.send(matches);
}

const getStats = (req, rep) => {
    const { username } = req.params;
    const stat = db.prepare("SELECT * FROM user_stats \
        WHERE username = ? ").get(username);
    if (!stat)
        return rep.code(404).send({ error: "User not found" });
    rep.send(stat);
}

const getLeaderboard = async (req, rep) => {
    try {
        const stmt = db.prepare(`
            SELECT
                us.username, 
                us.xp,
                CAST(us.total_wins AS FLOAT) / us.total_matches as win_rate,
                DENSE_RANK() OVER (ORDER BY us.xp DESC) as rank,
                u.avatar
            FROM user_stats us
            JOIN users u ON us.username = u.username
            ORDER BY rank ASC
            LIMIT 6
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
                    DENSE_RANK() OVER (ORDER BY xp DESC) as rank
                FROM user_stats
            )
            SELECT 
                rp.username, 
                rp.xp, 
                rp.total_wins, 
                rp.rank,
                u.avatar
            FROM RankedPlayers rp
            JOIN users u ON rp.username = u.username
            WHERE rp.username = ?
        `);

        const player = stmt.get(username);

        if (!player) {
            return rep.code(404).send({ error: "Player not found" });
        }
        rep.send(player);
    } catch (err) {
        console.error(err);
        rep.code(500).send({ error: "Erreur serveur" });
    }
}

const getPlayersRank = async (req, rep) => {
    const { username } = req.params;

    try {
        const stmt = db.prepare(`
            WITH RankedPlayers AS (
                SELECT 
                    username, 
                    xp, 
                    total_wins,
                    DENSE_RANK() OVER (ORDER BY xp DESC) as rank,
                    ROW_NUMBER() OVER (ORDER BY xp DESC, total_wins DESC, username ASC) as row_num
                FROM user_stats
            )
            SELECT 
                username, 
                xp, 
                total_wins,
                rank
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
    const { player1, player2, winner, score_p1, score_p2, duration, stats_p1, stats_p2 } = req.body;
    const loser = (winner === player1) ? player2 : player1;
    const winnerReturned = (winner === player1) ? stats_p1.returns : stats_p2.returns;
    const loserReturned = (winner === player1) ? stats_p2.returns : stats_p1.returns;
    const winnerMaxCombo = (winner === player1) ? stats_p1.maxCombo : stats_p2.maxCombo;
    const loserMaxCombo = (winner === player1) ? stats_p2.maxCombo : stats_p1.maxCombo;
    const isPerfectWin =
        (winner === player1 && score_p2 === 0) ||
        (winner === player2 && score_p1 === 0);

    const insertMatch = db.prepare(`
        INSERT INTO matches (
          player1, player2, winner,
          score_p1, score_p2,
          duration, p1_returned, p2_returned
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

    const updateWinner = db.prepare(`
        INSERT INTO user_stats (
          username, total_matches, total_wins, total_losses,
          total_duration, xp, streak, max_streak,
          returned, maxCombo, total_xp, winning
        )
        VALUES (?, 1, 1, 0, ?, 10, 1, 1, ?, ?, 10, ?)
        ON CONFLICT(username) DO UPDATE SET
          total_matches = total_matches + 1,
          total_wins = total_wins + 1,
          total_duration = total_duration + ?,
          xp = xp + 10,
          streak = streak + 1,
          max_streak = MAX(max_streak, streak + 1),
          returned = returned + ?,
          maxCombo = MAX(maxCombo, ?),
          total_xp = total_xp + 10,
          winning = winning + ?
      `);


    const updateLoser = db.prepare(`
        INSERT INTO user_stats (
          username, total_matches, total_wins, total_losses,
          total_duration, xp, streak, returned, maxCombo,total_xp 
        )
        VALUES (?, 1, 0, 1, ?, 0, 0, ?, ?, 0)
        ON CONFLICT(username) DO UPDATE SET
          total_matches = total_matches + 1,
          total_losses = total_losses + 1,
          total_duration = total_duration + ?,
          xp = MAX(0, xp - 10),
          streak = 0,
          returned = returned + ?,
          maxCombo = MAX(maxCombo, ?)
      `);


    const transaction = db.transaction(() => {
        insertMatch.run(player1, player2, winner, score_p1, score_p2, duration, stats_p1.returns, stats_p2.returns);
        
        const perfectWinValue = isPerfectWin ? 1 : 0;
        updateWinner.run(winner, duration, winnerReturned, winnerMaxCombo, perfectWinValue, duration, winnerReturned, winnerMaxCombo, perfectWinValue);
        
        updateLoser.run(loser, duration, loserReturned, loserMaxCombo, duration, loserReturned, loserMaxCombo);
    });

    try {
        transaction();
        rep.code(200).send({ message: "Match recorded and stats updated" });
    } catch (err) {
        console.error(err);
    }
}

export { addMatch, getuserMatches, getStats, getLeaderboard, getPlayerRank, getPlayersRank }