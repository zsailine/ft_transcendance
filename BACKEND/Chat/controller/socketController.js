import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const socketAuth = async (socket, next) => {
	try {
		const token = socket.handshake.auth?.token;
		console.log(token)
		if (!token || !token.startsWith("Bearer ")) {
			return next(new Error("Unauthorized"));
		}
		
		const decoded = jwt.verify(token.substring(7), process.env.JWT_SECRET);
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
		return next(new Error("Unauthorized"));
	}
};
