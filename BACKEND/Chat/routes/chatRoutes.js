import { getAllContacts, sendMessage } from "../controller/chatController.js";

export default async function chatRoutes(fastify) {

	fastify.get("/message/contacts", { handler: getAllContacts });

	fastify.post("/message/send/:username", { handler: sendMessage })
}
