import {
	acceptRequest, 
	blockUser,
	declineRequest,
	deleteSum,
	getAllFriends,
	getFriendRequests,
	getRelationship,
	sendFriendRequest
} from "../controller/friendController.js";

import {
	getNonFriends
} from "../controller/nonFriendController.js";

export default async function friendRoutes(fastify) {

	fastify.get("/friend/status/:username", { handler: getRelationship });

	fastify.get("/friend/all", { handler: getAllFriends })

	fastify.get("/friend/request/all", { handler: getFriendRequests })

	fastify.get("/friend/non-friends", { handler: getNonFriends });

	fastify.post("/friend/request/:username", { handler: sendFriendRequest });

	fastify.post("/friend/delete", { handler: deleteSum });

	fastify.put("/friend/request/:username/accept", { handler: acceptRequest });

	fastify.put("/friend/request/:username/decline", { handler: declineRequest });

	fastify.put("/friend/request/:username/block", { handler: blockUser });
}
