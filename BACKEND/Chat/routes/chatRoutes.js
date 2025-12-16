import { getAllContacts, getSelectedMessages, sendMessage } from "../controller/chatController.js";
import { statusDelivered, statusRead } from "../controller/chatStatus.js";

export default async function chatRoutes(fastify) {

	fastify.get("/message/contacts", { handler: getAllContacts });

	fastify.get("/message/get/:username", { handler: getSelectedMessages });

	fastify.post("/message/send/:username", { handler: sendMessage });

	fastify.put("/message/:id/delivered", { handler: statusDelivered });

	fastify.put("/message/:id/read", { handler: statusRead });
}
