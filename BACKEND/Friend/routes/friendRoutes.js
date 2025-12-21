import {
	acceptRequest, 
	blockUser,
	declineRequest,
	getAllFriends,
	getFriendRequests,
	getRelationship,
	sendFriendRequest,
	unblockUser
} from "../controller/friendController.js";

import {
	getAllBlocked,
	getBlocker,
	getNonFriends,
	getUsersRelated
} from "../controller/nonFriendController.js";

export default async function friendRoutes(fastify) {

	fastify.get("/friend/status/:username", { handler: getRelationship });

	fastify.get("/friend/all", { handler: getAllFriends });

	fastify.get("/friend/blocked/all", { handler: getAllBlocked });

	fastify.get("/friend/request/all", { handler: getFriendRequests })

	fastify.get("/friend/related", { handler: getUsersRelated })

	fastify.get("/friend/non-friends", { handler: getNonFriends });

	fastify.get("/friend/:username/blocked_by", { handler: getBlocker });

	fastify.post("/friend/request/:username", { handler: sendFriendRequest });

	fastify.post("/friend/request/:username/accept", { handler: acceptRequest });

	fastify.post("/friend/request/:username/decline", { handler: declineRequest });

	fastify.post("/friend/request/:username/block", { handler: blockUser });

	fastify.post("/friend/request/:username/unblock", { handler: unblockUser });
}
