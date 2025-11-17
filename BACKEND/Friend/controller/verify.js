import db from "../migration.js";

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

export { getUsername, getWhat };
