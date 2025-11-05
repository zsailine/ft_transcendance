import db from "../migration.js";
import axios from "axios"

const AUTH_URL = "http://localhost:3002/auth";
const USER_URL = "http://localhost:3001/users";

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

const getAllContacts = async (req, rep) => {
	try {
		const loggedInUsername = await getUsername(req, rep, `${AUTH_URL}/me`);

		const allUsers = await axios.get(`${USER_URL}/all`);
		const contacts = allUsers.data.filter(user => user.username !== loggedInUsername);
		rep.status(200).send(contacts);	

	} catch(error) {
		console.error("Error getting contacts:", error);
		rep.status(500).send({
			message: "Internal Server Error",
			details: error.message
		});
	}
}

const sendMessage = async (req, rep) => {
	try {
		const senderUsername = await getUsername(req, rep, `${AUTH_URL}/me`);
		const	receiverUsername = req.params.username;
		
		if (senderUsername === receiverUsername) {
			rep.status(400).send({ error: "Can't send message to yourself" });
		}

		const { text, image } = req.body;

		if (!text && !image) {
			rep.status(400).send({ error: "Need to have a text or an image" });
		}

		let imageUrl = image;
		
		const message = db.prepare(`INSERT INTO message (sender_username, receiver_username, text, image)
			VALUES (?, ?, ?, ?)`).run(senderUsername, receiverUsername, text || null, imageUrl || null);
		const messageId = message.lastInsertRowid;
		const newMessage = db.prepare(`SELECT * FROM message WHERE id = ?`).get(messageId);
		rep.status(200).send(newMessage);

	} catch(error) {
		console.error("Error sending message:", error);
		rep.status(500).send({
			message: "Internal Server Error",
			details: error.message
		});
	}
}

export { getAllContacts, sendMessage };
