import {
	acceptRequest, 
	blockUser,
	declineRequest,
	getAllFriends,
	getFriendRequests,
	getRelationship,
	sendFriendRequest
} from "../controller/friendController.js";

import {
	getNonFriends,
	getUsersRelated
} from "../controller/nonFriendController.js";

export default async function friendRoutes(fastify) {

	fastify.get("/friend/status/:username", { handler: getRelationship });

	fastify.get("/friend/all", { handler: getAllFriends })

	fastify.get("/friend/request/all", { handler: getFriendRequests })

	fastify.get("/friend/related", { handler: getUsersRelated })

	fastify.get("/friend/non-friends", { handler: getNonFriends });

	fastify.post("/friend/request/:username", { handler: sendFriendRequest });

	fastify.put("/friend/request/:username/accept", { handler: acceptRequest });

	fastify.put("/friend/request/:username/decline", { handler: declineRequest });

	fastify.put("/friend/request/:username/block", { handler: blockUser });
}
