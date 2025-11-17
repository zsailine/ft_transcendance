import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const socketAuth = async (socket, next) => {
	try {
		const token = socket.handshake.headers.cookie;
		if (!token) {
			return next(new Error("Unauthorized"));
		}
		
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
