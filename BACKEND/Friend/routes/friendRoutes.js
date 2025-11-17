import { acceptRequest, declineRequest, getAllFriends, getRelationship, sendFriendRequest } from "../controller/friendController.js";

export default async function friendRoutes(fastify) {

	fastify.get("/friend/status/:username", { handler: getRelationship });

	fastify.get("/friend/all", { handler: getAllFriends })

	fastify.post("/friend/request/:username", { handler: sendFriendRequest });

	fastify.put("/friend/request/:username/accept", { handler: acceptRequest });

	fastify.put("/friend/request/:username/decline", { handler: declineRequest });
}
