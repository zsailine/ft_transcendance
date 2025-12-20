import axios from "axios";
import { friendsList, getCookies, getUsername } from "./verify.js";
import db from "../migration.js";

const CHAT_URL = "http://localhost:3004";
const FRIEND_URL = "http://localhost:3007"

const getUsersRelated = async (req, rep) => {
	try {
		const loggedInUsername = await getUsername(req, rep, "http://localhost:3002/auth/me");
		const related = db.prepare(`SELECT * FROM friendship where (user_a=? OR user_b=?)`)
			.all(loggedInUsername, loggedInUsername);
		const listRelated = await friendsList(req, rep, related);
		if (listRelated) {
			return rep.status(200).send(listRelated);
		} else {
			return rep.status(200).send([]);
		}
	} catch(error) {
		console.log("Something went wrong:", error.message);
	}
}

const getNonFriends = async (req, rep) => {
	try {
		const cookies = await getCookies(req);
		const users = await axios.get(`${CHAT_URL}/message/contacts`,
			{ headers: { 'Cookie': cookies }});
		const friends = await axios.get(`${FRIEND_URL}/friend/related`,
			{ headers: { 'Cookie': cookies }});
		const usernames = new Set(friends.data.map(friend => friend.username));
		const nonFriends = users.data.filter((user) => {
			return usernames.has(user.username) === false;
		});
		if (nonFriends) {
			return rep.status(200).send(nonFriends);
		} else {
			return rep.status(200).send([]);
		}
	} catch(error) {
		console.log(error.message);
		return rep.status(500).send({
			error: "Error in fetchin non Friends"
		});
	}
}

const getAllBlocked = async (req, rep) => {
	try {
		const username = await getUsername(req, rep);
		const blockedDB = db.prepare(`SELECT * FROM friendship WHERE blocked_by=?`).all(username);
		const blocked = await friendsList(req, rep, blockedDB);
		if (blocked) {
			rep.status(200).send(blocked);
		} else {
			rep.status(200).send([]);
		}
	} catch(error) {
		console.log(error.message);
		return rep.status(500).send({
			error: "Error in fetchin blocked users"
		});
	}
}

const insertBlockedUser = ([user_a, user_b], loggedInUsername) => {
	try {
		const relation = db.prepare(`SELECT * FROM friendship WHERE (user_a=? AND user_b=?)`)
			.get(user_a, user_b);
		if (relation)
			return ;
		db.prepare(`INSERT INTO friendship (user_a, user_b, sender, is_friend)
			VALUES (?, ?, ?, ?)`).run(user_a, user_b, loggedInUsername, 0);
	} catch(error) {
		console.log("Error in inserting blocked:", error.message);
	}
}

const getBlocker = async (req, rep) => {
	try {
		const loggedInUsername = await getUsername(req, rep);
		const receiverUsername = req.params.username;
		const [user_a, user_b] = [loggedInUsername, receiverUsername].sort();
		const blocker = db.prepare(`SELECT blocked_by FROM friendship WHERE (user_a=? AND user_b=?)`)
			.get(user_a, user_b);
		rep.status(200).send(blocker);
	} catch(error) {
		console.log("Error in getting blocker:", error.message);
	}
}

export {
	getNonFriends,
	getUsersRelated,
	getAllBlocked,
	insertBlockedUser,
	getBlocker
};
