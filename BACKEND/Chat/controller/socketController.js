import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const getToken = (token) => {
	if (token.startsWith("token=")) {
		return token;
	}
	const cookies = token.split(";").map(t => t.trim());
	for(const c of cookies) {
		if (c.startsWith("token=")) {
			return c;
		}
	}
	return token;
}

export const socketAuth = async (socket, next) => {
	try {
		let token = socket.handshake.headers.cookie;
		if (!token || !token.includes("token=")) {
			return next(new Error("Unauthorized"));
		}
		token = getToken(token);
		
		const decoded = jwt.verify(token.substr(6), process.env.JWT_SECRET);
		if (!decoded) {
			return next(new Error("Unauthorized"));
		}

		const username = decoded.username;
		if (!username) {
			return next(new Error("User not found"));
		}

		socket.username = username;
		next();
	} catch(error) {
		console.log(error.message);
		return next(new Error("Unauthorized"));
	}
};
