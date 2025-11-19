import {
	acceptRequest, 
	blockUser,
	declineRequest,
	getAllFriends,
	getFriendRequests,
	getRelationship,
	sendFriendRequest
} from "../controller/friendController.js";

export default async function friendRoutes(fastify) {

	fastify.get("/friend/status/:username", { handler: getRelationship });

	fastify.get("/friend/all", { handler: getAllFriends })

	fastify.get("/friend/request/all", { handler: getFriendRequests })

	fastify.post("/friend/request/:username", { handler: sendFriendRequest });

	fastify.put("/friend/request/:username/accept", { handler: acceptRequest });

	fastify.put("/friend/request/:username/decline", { handler: declineRequest });

	fastify.put("/friend/request/:username/block", { handler: blockUser });
}
