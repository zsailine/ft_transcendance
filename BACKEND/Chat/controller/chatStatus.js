import { getUsername } from "../controller/chatController.js";
import db from "../migration.js";
import { getReceiverSocket, fastify } from "../server.js";

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

export {
	statusRead
}
