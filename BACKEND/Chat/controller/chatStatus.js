import { getUsername } from "../controller/chatController.js";
import db from "../migration.js";
import { getReceiverSocket, fastify } from "../server.js";
import axios from "axios";

const statusRead = async (req, rep) => {
	const id  = parseInt(req.params.id);
	const tmp = db.prepare(`SELECT * FROM message WHERE id=?`).get(id);
	const changes =	db.prepare(`UPDATE message SET status='read' WHERE
		(id<=? AND sender_username=? AND receiver_username=? AND status!='read')`)
		.run(id, tmp.sender_username, tmp.receiver_username);
	const senderSocket = getReceiverSocket(tmp.sender_username);
	if (senderSocket)
		fastify.io.to(senderSocket).emit("message read", {
			last: id,
			status: 'read',
			conversation: await getUsername(req, rep)
		});
	if (changes.changes > 0) {
		return rep.status(200).send({statsu: "success"});
	}
	return rep.status(200).send({statsu: "success"});
}

const usersExist = async (user_1, user_2) => {
	try {
		const all = await axios.get("http://localhost:3001/users/all");
		const usernames = all.data.map(user => user.username);
		if (usernames.includes(user_1) && usernames.includes(user_2))
			return true;
		return false;
	} catch(error) {
		return false;
	}
}

export {
	statusRead,
	usersExist
}
