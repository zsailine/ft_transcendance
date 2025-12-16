import db from "../migration.js";

const statusDelivered = (req, rep) => {
	const id = req.params.id;
	const tmp = db.prepare(`SELECT * FROM message WHERE id=?`).get(id);
	const changes =	db.prepare(`UPDATE message SET status='delivered' WHERE
		(id<=? AND sender_username=? AND receiver_username=? AND status!='delivered')`)
		.run(id, tmp.sender_username, tmp.receiver_username);
	if (changes.changes > 0) {
		return rep.status(200);
	} else {
		return rep.status(404);
	}
}

const statusRead = (req, rep) => {
	const id  = req.params.id;
	const tmp = db.prepare(`SELECT * FROM message WHERE id=?`).get(id);
	const changes =	db.prepare(`UPDATE message SET status='read' WHERE
		(id<=? AND sender_username=? AND receiver_username=? AND status!='read')`)
		.run(id, tmp.sender_username, tmp.receiver_username);
	if (changes.changes > 0) {
		return rep.status(200);
	} else {
		return rep.status(404);
	}
}

export {
	statusDelivered,
	statusRead
}
