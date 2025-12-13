import db from "../migration.js";
import { fastify, getReceiverSocket } from "../server.js";
import { insertBlockedUser } from "./nonFriendController.js";
import { deleteBlockedUsers, friendsList, getUsername, getWhat, isFriend, thoseWhoSentMe, whatToEmit } from "./verify.js";

const AUTH_URL = "http://localhost:3002/auth/me";

const sendFriendRequest = async (req, rep) => {
	try {
		const loggedInUsername = await getUsername(req, rep, AUTH_URL);
		const receiverUsername = req.params.username;
		if (loggedInUsername === receiverUsername) {
			return rep.status(400).send({ error: "Can't send friend request to yourself" }); }
		const [user_a, user_b] = [loggedInUsername, receiverUsername].sort();
		const newFriendship = db.prepare(`INSERT INTO friendship (user_a, user_b, status, sender, is_friend)
			VALUES (?, ?, ?, ?, ?)`).run(user_a, user_b, 'pending', loggedInUsername, 0);
		const friendship = db.prepare(`SELECT * FROM friendship WHERE id=?`).get(newFriendship.lastInsertRowid);
		const receiverSocket = getReceiverSocket(receiverUsername);
		const senderSocket = getReceiverSocket(loggedInUsername);
		if (receiverSocket)
			fastify.io.to(receiverSocket).emit("request sent", friendship);
		if (senderSocket)
			fastify.io.to(senderSocket).emit("request sent", friendship);
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
		const [ user_a, user_b ] = [loggedInUsername, receiverUsername].sort();
		const status = db.prepare(`SELECT status FROM friendship WHERE (user_a=? AND user_b=?)`)
			.get(user_a, user_b);
		if (!status) {
			rep.status(200).send({ status: "none" });
		} else {
			rep.status(200).send(status);
		}
	} catch(error) {
		rep.status(500).send({
			error: "Cannot send friend request"
		});
	}
};

const getAllFriends = async (req, rep) => {
	try {
		const friends = await getWhat(req, rep, "", 1);
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
		const [user_a, user_b] = [loggedInUsername, receiverUsername].sort();
		const request = db.prepare(`UPDATE friendship SET status='accepted',is_friend=1 WHERE (user_a=? AND user_b=?)`)
			.run(user_a, user_b);
		if (request.changes > 0) {
			rep.status(200).send({ status: "Friend request accepted" });
			const friendship = db.prepare(`SELECT * FROM friendship WHERE (user_a=? AND user_b=?)`).get(user_a, user_b);
			const receiverSocket = getReceiverSocket(receiverUsername);
			const senderSocket = getReceiverSocket(loggedInUsername);
			if (receiverSocket)
				fastify.io.to(receiverSocket).emit("request accepted", friendship);
			if (senderSocket)
				fastify.io.to(senderSocket).emit("request accepted", friendship);
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
		const [user_a, user_b] = [loggedInUsername, receiverUsername].sort();
		const request = db.prepare(`UPDATE friendship SET status='declined',is_friend=0 WHERE (user_a=? AND user_b=?)`)
			.run(user_a, user_b);
		if (request.changes > 0) {
			const toDelete = db.prepare(`SELECT id FROM friendship WHERE
				(user_a=? AND user_b=?) AND status='declined'`)
				.get(user_a, user_b);
			const id = toDelete.id;
			if (id) {
				const friendship = db.prepare("SELECT * FROM friendship WHERE id=?").get(id);
				const receiverSocket = getReceiverSocket(receiverUsername);
				const senderSocket = getReceiverSocket(loggedInUsername);
				if (receiverSocket)
					fastify.io.to(receiverSocket).emit("request declined", friendship);
				if (senderSocket)
					fastify.io.to(senderSocket).emit("request declined", friendship);
				db.prepare(`DELETE FROM friendship WHERE id=?`).run(id);
			}
			return rep.status(200).send({ status: "Friend request declined" });
		} else {
			return rep.status(404).send({ status: "No pending request" });
		}
	} catch(error) {
		rep.status(500).send({
			error: "Cannot decline friend request"
		});
	}
}

const getFriendRequests = async (req, rep) => {
	try {
		const requests = await getWhat(req, rep, "pending", 0);
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

const blockUser = async (req, rep) => {
	try {
		const loggedInUsername = await getUsername(req, rep, AUTH_URL);
		const receiverUsername = req.params.username;
		if (loggedInUsername === receiverUsername) {
			rep.status(400).send({ error: "Can't block yourself" }); }
		const [user_a, user_b] = [loggedInUsername, receiverUsername].sort();
		insertBlockedUser([user_a, user_b], loggedInUsername);
		const request = db.prepare(`UPDATE friendship SET status='blocked',blocked_by=? WHERE (user_a=? AND user_b=?)`)
			.run(loggedInUsername, user_a, user_b);
		if (request.changes > 0) {
			whatToEmit(user_a, user_b);
			return rep.status(200).send({ status: "User blocked" });
		} else {
			return rep.status(404).send({ status: "User not found" });
		}
	} catch(error) {
		rep.status(500).send({
			error: "Cannot block user"
		});
	}
}

const unblockUser = async (req, rep) => {
	try {
		const loggedInUsername = await getUsername(req, rep, AUTH_URL);
		const receiverUsername = req.params.username;
		if (loggedInUsername === receiverUsername) {
			rep.status(400).send({ error: "Can't block yourself" }); }
		const [user_a, user_b] = [loggedInUsername, receiverUsername].sort();
		const request = db.prepare(`UPDATE friendship SET status='accepted' WHERE (user_a=? AND user_b=?)`).run(user_a, user_b);
		if (request.changes > 0) {
			rep.status(200).send({ status: "User unblocked" });
			deleteBlockedUsers(user_a, user_b);
		} else {
			rep.status(404).send({ status: "User not found" });
		}
	} catch(error) {
		rep.status(500).send({
			error: "Cannot block user"
		});
	}
}

export {
	sendFriendRequest,
	getRelationship,
	getAllFriends,
	acceptRequest,
	declineRequest,
	blockUser,
	getFriendRequests,
	unblockUser
};
