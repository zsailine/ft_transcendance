import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const socketAuth = async (socket, next) => {
	try {
		const token = socket.handshake.auth?.token;
		if (!token || !token.startsWith("Bearer ")) {
			console.log("Invalid token");
			return next(new Error("Unauthorized"));
		}
		
		const decoded = jwt.verify(token.substring(7), process.env.JWT_SECRET);
		if (!decoded) {
			console.log("Invalid token");
			return next(new Error("Unauthorized"));
		}

		const username = decoded.username;
		if (!username) {
			console.log("User not found");
			return next(new Error("User not found"));
		}

		socket.username = username;
		next();

		console.log(`Socket authenticated for ${socket.username}`);

	} catch(error) {
		console.log("Error in socketAuth:", error.message);
		return next(new Error("Unauthorized"));
	}
};
