import db from "../migration.js";
import axios from "axios";

const AUTH_URL = "http://localhost:3002/auth/me";

const getUsername = async (req, rep) => {
	const token = req.cookies?.token;
	if (!token)
		console.log("\n\nMISSING TOKEN\n\n");

	try {
		const decoded = req.server.jwt.decode(token);
		if (decoded)
			return decoded.username;
	} catch(error) {
		console.log(error.message);
		rep.status(500).send({
			error: "Verification service error, failed to fetch username"
		});
	}
}

const getWhat = async (req, rep, status) => {
	try {
		const loggedInUsername = await getUsername(req, rep, AUTH_URL);
		const toGet = db.prepare(`SELECT * FROM friendship WHERE
			(username_first=? OR username_second=?) AND status=?`)
			.all(loggedInUsername, loggedInUsername, status);
		return toGet;
	} catch(error) {
		console.log("Something went wrong", error.message);
	}
}

const friendsList = async (req, rep, friends) => {
	let allFriends;
	const loggedInUsername = await getUsername(req, rep);

	friends.map(async friend => {
		let user;
		friend.username_first === loggedInUsername ?
			user = friend.username_second : user = friend.username_first;
		const avatar = await axios.get(`http://localhost:3001/users/${user}/avatar`);
		console.log(avatar);
	});
	return allFriends;
}

export { getUsername, getWhat, friendsList };
