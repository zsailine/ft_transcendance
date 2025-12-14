import db from "../migration.js";
import axios from "axios";
import { fastify, getReceiverSocket } from "../server.js";

const AUTH_URL = "http://localhost:3002/auth/me";

const getUsername = async (req, rep) => {
	const cookies = await getCookies(req);
	const user = await axios.get("http://localhost:3002/auth/me", {
		headers: {
			'Cookie': cookies
		}
	});
	if (user) {
		return user.data.user;
	}
	return "";
}

const getCookies = async (req) => {
	const cookies = req.cookies;
	const realCookies = Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join("; ");
	return realCookies;
}

const getWhat = async (req, rep, status, is_friend) => {
	try {
		let what, value;

		if (!status && is_friend) {
			what = "is_friend";
			value = is_friend;
		} else if (status && !is_friend) {
			what = "status";
			value = status;
		}
		const loggedInUsername = await getUsername(req, rep, AUTH_URL);
		const toGet = db.prepare(`SELECT * FROM friendship WHERE
			(user_a=? OR user_b=?) AND ${what}=?`)
			.all(loggedInUsername, loggedInUsername, value);
		return toGet;
	} catch(error) {
		console.log("Something went wrong", error.message);
	}
}

const friendsList = async (req, rep, friends) => {
	let allFriends = [];
	const loggedInUsername = await getUsername(req, rep);

	const friendPromises = friends.map(async friend => {
		let user;
		(friend.user_a === loggedInUsername) ?
			user = friend.user_b: user = friend.user_a;
		const avatar = await axios.get(`http://localhost:3001/users/${user}/avatar`);
		const id = await axios.get(`http://localhost:3001/users/${user}/id`);
		return ({
			id: id.data.id,
			username: user,
			avatar: avatar.data.avatar
		});
	});
	allFriends = await Promise.all(friendPromises);
	return allFriends;
}

const thoseWhoSentMe = async (req, rep, friends) => {
	let allRequests = [];
	const loggedInUsername = await getUsername(req, rep);

	friends = friends.filter((friend) => {
		return friend.sender !== loggedInUsername;
	});
	const friendPromises = friends.map(async friend => {
		const user = friend.sender;
		const avatar = await axios.get(`http://localhost:3001/users/${user}/avatar`);
		const id = await axios.get(`http://localhost:3001/users/${user}/id`);
		return ({
			id: id.data.id,
			username: user,
			avatar: avatar.data.avatar
		});
	});
	allRequests = await Promise.all(friendPromises);
	return allRequests;
}

const deleteBlockedUsers = (user_a, user_b, loggedInUsername, receiverUsername) => {
	const is_friend = db.prepare("SELECT is_friend FROM friendship WHERE (user_a=? AND user_b=?)")
		.get(user_a, user_b);
	const friendship = db.prepare("SELECT * FROM friendship WHERE (user_a=? AND user_b=?)")
		.get(user_a, user_b);
	const senderSocket = getReceiverSocket(user_a);
	const receiverSocket = getReceiverSocket(user_b);
	const recSockets = getReceiverSocket(receiverUsername);
	const logSockets = getReceiverSocket(loggedInUsername);
	if (is_friend.is_friend === 0) {
		const toDelete = db.prepare(`SELECT id FROM friendship WHERE (user_a=? AND user_b=?)`)
			.get(user_a, user_b);
		const id = toDelete.id;
		if (senderSocket)
			fastify.io.to(senderSocket).emit("non-friend user unblocked", friendship);
		if (receiverSocket)
			fastify.io.to(receiverSocket).emit("non-friend user unblocked", friendship);
		if (id)
			db.prepare(`DELETE FROM friendship WHERE id=?`).run(id);
	} else {
		if (senderSocket)
			fastify.io.to(senderSocket).emit("friend unblocked", friendship);
		if (receiverSocket)
			fastify.io.to(receiverSocket).emit("friend unblocked", friendship);
		if (recSockets)
			fastify.io.to(recSockets).emit("i am unblocked");
		if (logSockets)
			fastify.io.to(logSockets).emit("i unblocked");
		db.prepare(`UPDATE friendship SET blocked_by=NULL WHERE (user_a=? AND user_b=?)`).run(user_a, user_b);
	}
}

const whatToEmit = (user_a, user_b, loggedInUsername, receiverUsername) => {
	const is_friend = db.prepare("SELECT is_friend FROM friendship WHERE (user_a=? AND user_b=?)").get(user_a, user_b);
	const friendship = db.prepare("SELECT * FROM friendship WHERE (user_a=? AND user_b=?)").get(user_a, user_b);
	const receiverSocket = getReceiverSocket(user_a);
	const senderSocket = getReceiverSocket(user_b);
	const recSockets = getReceiverSocket(receiverUsername);
	const logSockets = getReceiverSocket(loggedInUsername);
	if (is_friend.is_friend === 0) {
		if (senderSocket)
			fastify.io.to(senderSocket).emit("non-friend user blocked", friendship);
		if (receiverSocket)
			fastify.io.to(receiverSocket).emit("non-friend user blocked", friendship);
	} else {
		if (senderSocket)
			fastify.io.to(senderSocket).emit("friend blocked", friendship);
		if (receiverSocket)
			fastify.io.to(receiverSocket).emit("friend blocked", friendship);
		if (recSockets)
			fastify.io.to(recSockets).emit("i am blocked");
		if (logSockets)
			fastify.io.to(logSockets).emit("i blocked");
	}
}

const isFriend = (user_a, user_b) => {
	const is_friend = db.prepare("SELECT is_friend FROM friendship WHERE (user_a=? AND user_b=?)").get(user_a, user_b);
	if (is_friend.is_friend === 0) {
		return false;
	}
	return true;
}

const isBlocked = (user_a, user_b) => {
	const status = db.prepare("SELECT status FROM friendship WHERE (user_a=? AND user_b=?)").get(user_a, user_b);
	if (status.status === "blocked") {
		return true;
	}
	return false;
}

export { getUsername, getWhat, friendsList, thoseWhoSentMe, getCookies, deleteBlockedUsers, whatToEmit, isFriend, isBlocked };
