import db from "../migration.js";
import axios from "axios";

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

const getWhat = async (req, rep, status) => {
	try {
		const loggedInUsername = await getUsername(req, rep, AUTH_URL);
		const toGet = db.prepare(`SELECT * FROM friendship WHERE
			(sender=? OR receiver=?) AND status=?`)
			.all(loggedInUsername, loggedInUsername, status);
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
		(friend.sender === loggedInUsername) ?
			user = friend.receiver: user = friend.sender;
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
		return friend.receiver === loggedInUsername;
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

export { getUsername, getWhat, friendsList, thoseWhoSentMe, getCookies };
