import db from "../migration.js";
import axios from "axios"
import { fastify, getReceiverSocket } from "../server.js";

const USER_URL = "http://localhost:3001/users";

const getUsername = async (req, rep) => {
	const cookies = req.cookies;
	const realCookies = Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join("; ");
	const user = await axios.get("http://localhost:3002/auth/me", {
		headers: {
			'Cookie': realCookies
		}
	});
	if (user) {
		return user.data.user;
	}
	return "";
}

const getAllContacts = async (req, rep) => {
	try {
		const loggedInUsername = await getUsername(req, rep);
		const allUsers = await axios.get(`${USER_URL}/all`);
		const contacts = allUsers.data.filter(user => user.username !== loggedInUsername);
		let filtered = [];

		contacts.map((one) => {
			filtered.push({
				id: one.id,
				username: one.username,
				avatar: one.avatar
			})
		});
		if (filtered) {
			return rep.status(200).send(filtered);
		}

	} catch(error) {
		console.error("Error getting contacts:", error);
		return rep.status(500).send({
			message: "Internal Server Error: get contact",
			details: error.message
		});
	}
}

const getSelectedMessages = async (req, rep) => {
	try {
		const senderUsername = await getUsername(req, rep);
		const	receiverUsername = req.params.username;

		if (senderUsername === receiverUsername) {
			return rep.status(400).send({ error: "Can't get message with yourself" });
		}

		const messages = db.prepare(`SELECT * FROM message WHERE
			(sender_username=? AND receiver_username=?) OR
			(sender_username=? AND receiver_username=?)
			ORDER BY created_at ASC`)
			.all(senderUsername, receiverUsername, receiverUsername, senderUsername);
		return rep.status(200).send(messages);

	} catch(error) {
		console.error("Error getting messages:", error);
		return rep.status(500).send({
			message: "Internal Server Error: get messages",
			details: error.message
		});
	}
}

const sendMessage = async (req, rep) => {
	try {
		const senderUsername = await getUsername(req, rep);
		const receiverUsername = req.params.username;
		
		if (senderUsername === receiverUsername) {
			rep.status(400).send({ error: "Can't send message to yourself" });
		}

		const { text, image } = req.body;

		if (!text && !image) {
			rep.status(400).send({ error: "Need to have a text or an image" });
		}

		let imageUrl = null;
		if (image) {
			imageUrl = Buffer.from(image);
		}
		
		const message = db.prepare(`INSERT INTO message (sender_username, receiver_username, text, image)
			VALUES (?, ?, ?, ?)`).run(senderUsername, receiverUsername, text || null, imageUrl);
		const messageId = message.lastInsertRowid;
		const newMessage = db.prepare(`SELECT * FROM message WHERE id = ?`).get(messageId);

		const receiverSocket = getReceiverSocket(receiverUsername);
		if (receiverSocket) {
			fastify.io.to(receiverSocket).emit("newMessage", newMessage);
		}

		rep.status(200).send(newMessage);

	} catch(error) {
		console.error("Error sending message:", error);
		rep.status(500).send({
			message: "Internal Server Error: send messages",
			details: error.message
		});
	}
}

export { getAllContacts, getSelectedMessages, sendMessage };
