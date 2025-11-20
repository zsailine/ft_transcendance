const addMatch = async (req, rep) => {
	const { player1, player2, winner, score_p1, score_p2, duration } = req.body;
	try {
		const stmt = db.prepare("INSERT into matches (player1, player2, winner, score_p1, score_p2) VALUES (?, ?, ?, ?, ?)");
		const result = stmt.run(player1, player2, winner, score_p1, score_p2);
		rep.code(201).send( "match added" );
	}
	catch (e) {
		rep.code(400).send({ error: "An error occured while inserting match" });
	}
}

const getuserMatches = (req, rep) => {
	const { username } = req.params;
	const matches = db.prepare("SELECT * FROM matches \
        WHERE player1 = ? OR player2 = ? \
        ORDER BY played_at DESC").all(username, username);
	rep.send(user);
}

export { addMatch, getuserMatches }