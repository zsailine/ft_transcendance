import db from "../migration.js";
import { fastify } from "../server.js";

const verifyToken = (req, rep) => {
	const token = req.headers.authorization;

	if (!token || !token.startsWith("Bearer ")) {
		rep.status(400).send({
			message: "Bad Request",
			details: "Bearer Token Missing"
		});
	}
	return token;
}

const getUsername = async (req, rep, url) => {
	const token = verifyToken(req, rep);
	const AuthMeResponse = await axios.get(url, {
		headers: {
			Authorization: token
		}
	});
	const loggedInUsername = AuthMeResponse.data.user;
	
	if (!loggedInUsername) {
		rep.status(500).send({
			error: "Verification service error, failed to fetch username"
		});
	}
	return loggedInUsername;
}

const sendFriendRequest = async (req, rep) => {
	try {
		const loggedInUsername = getUsername(req, rep, "http://localhost:3000/auth/me");
		const receiverUsername = req.params.username;

		if (loggedInUsername === receiverUsername) {
			rep.status(400).send({ error: "Can't send friend request to yourself" }); }
		
		const newFriendship = db.prepare(`INSERT INTO frienship (username_first, username_second, status)
			VALUES (?, ?, ?)`).run(loggedInUsername, receiverUsername, 'pending');
		rep.status(200).send(newFriendship);
	} catch(error) {
		rep.status(500).send({
			error: "Cannot send friend request"
		});
	}
};

export { sendFriendRequest };
