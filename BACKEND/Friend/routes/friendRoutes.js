import { sendFriendRequest } from "../controller/friendController.js";

export default async function friendRoutes(fastify) {

	fastify.post("/friend/request/:username", { handler: sendFriendRequest });
}
