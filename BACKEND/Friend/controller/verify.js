import db from "../migration.js";

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

export { getUsername, isBlocked };
