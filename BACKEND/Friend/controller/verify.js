import axios from "axios";
import db from "../migration.js";

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

const isBlocked = (loggedInUsername, checkUsername) => {
	try {
		const blocked = db.prepare(`SELECT * FROM friendship WHERE
			(username_first=? AND username_second=?) OR
			(username_first=? AND username_second=?)`)
			.get(loggedInUsername, checkUsername, checkUsername, loggedInUsername);
		if (!blocked) {
			return false;
		} else {
			return true;
		}
	} catch(error) {
		console.log("Error in fecthing blocked user:", error);
	}
};

export { verifyToken, getUsername, isBlocked };
