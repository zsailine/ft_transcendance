import db from "../migration.js";
import { getUsername, isBlocked } from "./verify.js";

const AUTH_URL = "http://localhost:3002/auth/me";

const sendFriendRequest = async (req, rep) => {
	try {
		const loggedInUsername = await getUsername(req, rep, AUTH_URL);
		const receiverUsername = req.params.username;
		let friendship;
		if (loggedInUsername === receiverUsername) {
			rep.status(400).send({ error: "Can't send friend request to yourself" }); }
		try {
			const newFriendship = db.prepare(`INSERT INTO friendship (username_first, username_second, status)
				VALUES (?, ?, ?)`).run(loggedInUsername, receiverUsername, 'pending');
			friendship = db.prepare(`SELECT * FROM friendship WHERE id=?`).get(newFriendship.lastInsertRowid);
		} catch(error) {
			rep.status(500).send({
				error: "Database error",
				detail: error.message,
			});
		}
		rep.status(200).send(friendship);
	} catch(error) {
		rep.status(500).send({
			error: "Cannot send friend request"
		});
	}
};

const getRelationship = async (req, rep) => {
	try {
		const loggedInUsername = await getUsername(req, rep, AUTH_URL);
		const receiverUsername = req.params.username;
		if (loggedInUsername === receiverUsername) {
			rep.status(400).send({ error: "Can't get relationship with yourself" }); }
		if (isBlocked(loggedInUsername, receiverUsername)) {
			rep.status(200).send({ status: "blocked" });
			return;
		}
		const status = db.prepare(`SELECT * FROM friendship WHERE
			(username_first=? AND username_second=?) OR
			(username_first=? AND username_second=?)`)
			.get(loggedInUsername, receiverUsername, receiverUsername, loggedInUsername);
		if (!status) {
			rep.status(200).send({ status: "none" });
		} else {
			rep.status(200).send({ status: status.status });
		}
	} catch(error) {
		rep.status(500).send({
			error: "Cannot send friend request"
		});
	}
};

const getAllFriends = async (req, rep) => {
	try {
		const loggedInUsername = await getUsername(req, rep, AUTH_URL);
		const friends = db.prepare(`SELECT * FROM friendship WHERE
			(username_first=? OR username_second=?) AND status=?`)
			.all(loggedInUsername, loggedInUsername, "accepted");
		if (!friends) {
			rep.status(200).send([]);
		} else {
			rep.status(200).send(friends);
		}
	} catch(error) {
		rep.status(500).send({
			error: "Cannot send friend request"
		});
	}
}

const acceptRequest = async (req, rep) => {
	try {
		const loggedInUsername = await getUsername(req, rep, AUTH_URL);
		const receiverUsername = req.params.username;
		if (loggedInUsername === receiverUsername) {
			rep.status(400).send({ error: "Can't accept your own request" }); }
		const request = db.prepare(`UPDATE friendship SET status='accepted' WHERE
			(username_first=? AND username_second=?) OR
			(username_first=? AND username_second=?)`)
			.run(loggedInUsername, receiverUsername, receiverUsername, loggedInUsername);
		if (request.changes > 0) {
			rep.status(200).send({ status: "Friend request accepted" });
		} else {
			rep.status(404).send({ status: "No pending request" });
		}
	} catch(error) {
		rep.status(500).send({
			error: "Cannot send friend request"
		});
	}
}

const declineRequest = async (req, rep) => {
	try {
		const loggedInUsername = await getUsername(req, rep, AUTH_URL);
		const receiverUsername = req.params.username;
		if (loggedInUsername === receiverUsername) {
			rep.status(400).send({ error: "Can't accept your own request" }); }
		const request = db.prepare(`UPDATE friendship SET status='declined' WHERE
			(username_first=? AND username_second=?) OR
			(username_first=? AND username_second=?)`)
			.run(loggedInUsername, receiverUsername, receiverUsername, loggedInUsername);
		if (request.changes > 0) {
			rep.status(200).send({ status: "Friend request decline" });
		} else {
			rep.status(404).send({ status: "No pending request" });
		}
	} catch(error) {
		rep.status(500).send({
			error: "Cannot send friend request"
		});
	}
}

export { sendFriendRequest, getRelationship, getAllFriends, acceptRequest, declineRequest };
