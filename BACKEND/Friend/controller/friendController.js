import db from "../migration.js";
import { friendsList, getUsername, getWhat, thoseWhoSentMe } from "./verify.js";

const AUTH_URL = "http://localhost:3002/auth/me";

const sendFriendRequest = async (req, rep) => {
	try {
		const loggedInUsername = await getUsername(req, rep, AUTH_URL);
		const receiverUsername = req.params.username;
		let friendship;
		if (loggedInUsername === receiverUsername) {
			return rep.status(400).send({ error: "Can't send friend request to yourself" }); }
		try {
			const newFriendship = db.prepare(`INSERT INTO friendship (sender, receiver, status)
				VALUES (?, ?, ?)`).run(loggedInUsername, receiverUsername, 'pending');
			friendship = db.prepare(`SELECT * FROM friendship WHERE id=?`).get(newFriendship.lastInsertRowid);
		} catch(error) {
			return rep.status(500).send({
				error: "Database error",
				detail: error.message,
			});
		}
		return rep.status(200).send(friendship);
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
		const status = db.prepare(`SELECT * FROM friendship WHERE
			(sender=? AND receiver=?) OR
			(sender=? AND receiver=?)`)
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
		const friends = await getWhat(req, rep, "accepted");
		const listFriends = await friendsList(req, rep, friends);
		if (!listFriends) {
			return rep.status(200).send([]);
		} else {
			return rep.status(200).send(listFriends);
		}
	} catch(error) {
		rep.status(500).send({
			error: "Cannot send fetch friends"
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
			(sender=? AND receiver=?) OR
			(sender=? AND receiver=?)`)
			.run(loggedInUsername, receiverUsername, receiverUsername, loggedInUsername);
		if (request.changes > 0) {
			rep.status(200).send({ status: "Friend request accepted" });
		} else {
			rep.status(404).send({ status: "No pending request" });
		}
	} catch(error) {
		rep.status(500).send({
			error: "Cannot accept friend request"
		});
	}
}

const declineRequest = async (req, rep) => {
	try {
		const loggedInUsername = await getUsername(req, rep, AUTH_URL);
		const receiverUsername = req.params.username;
		if (loggedInUsername === receiverUsername) {
			rep.status(400).send({ error: "Can't decline your own request" }); }
		const request = db.prepare(`UPDATE friendship SET status='declined' WHERE
			(sender=? AND receiver=?) OR
			(sender=? AND receiver=?)`)
			.run(loggedInUsername, receiverUsername, receiverUsername, loggedInUsername);
		if (request.changes > 0) {
			const toDelete = db.prepare(`SELECT id FROM friendship WHERE
				(sender=? AND receiver=?) AND status='declined'`)
				.get(receiverUsername, loggedInUsername);
			const id = toDelete.id;
			if (id)
				db.prepare(`DELETE FROM friendship WHERE id=?`).run(id);
			return rep.status(200).send({ status: "Friend request decline" });
		} else {
			return rep.status(404).send({ status: "No pending request" });
		}
	} catch(error) {
		rep.status(500).send({
			error: "Cannot decline friend request"
		});
	}
}

const blockUser = async (req, rep) => {
	try {
		const loggedInUsername = await getUsername(req, rep, AUTH_URL);
		const receiverUsername = req.params.username;
		if (loggedInUsername === receiverUsername) {
			rep.status(400).send({ error: "Can't block yourself" }); }
		const request = db.prepare(`UPDATE friendship SET status='blocked' WHERE
			(sender=? AND receiver=?) OR
			(sender=? AND receiver=?)`)
			.run(loggedInUsername, receiverUsername, receiverUsername, loggedInUsername);
		if (request.changes > 0) {
			rep.status(200).send({ status: "User blocked" });
		} else {
			rep.status(404).send({ status: "User not found" });
		}
	} catch(error) {
		rep.status(500).send({
			error: "Cannot block user"
		});
	}
}

const getFriendRequests = async (req, rep) => {
	try {
		const requests = await getWhat(req, rep, "pending");
		const listFriends = await thoseWhoSentMe(req, rep, requests);
		if (!listFriends) {
			return rep.status(200).send([]);
		} else {
			return rep.status(200).send(listFriends);
		}
	} catch(error) {
		rep.status(500).send({
			error: "Cannot fetch requests list"
		});
	}
}

const deleteSum = async (req, rep) => {
	db.prepare(`DELETE FROM friendship WHERE id=?`).run(1);
	db.prepare(`DELETE FROM friendship WHERE id=?`).run(2);
	db.prepare(`DELETE FROM friendship WHERE id=?`).run(4);
	db.prepare(`DELETE FROM friendship WHERE id=?`).run(5);
	db.prepare(`DELETE FROM friendship WHERE id=?`).run(6);
	db.prepare(`DELETE FROM friendship WHERE id=?`).run(32);
	db.prepare(`DELETE FROM friendship WHERE id=?`).run(33);
}

export {
	sendFriendRequest,
	getRelationship,
	getAllFriends,
	acceptRequest,
	declineRequest,
	blockUser,
	getFriendRequests,
	deleteSum
};
