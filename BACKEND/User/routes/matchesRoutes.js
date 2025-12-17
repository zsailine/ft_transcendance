import { addMatch, getStats, getuserMatches, getLeaderboard, getPlayerRank } from "../controller/matchesController.js";

export default async function matchesRoutes(fastify) {
	const db = fastify.db;

	fastify.get("/matches/:username", {handler:  getuserMatches});

	fastify.get("/matches/stats/:username", {handler:  getStats});

	fastify.get("/matches/leaderboard", {handler: getLeaderboard});

	fastify.get("/matches/rank/:username", {handler: getPlayerRank})

	fastify.post("/matches/add", {handler: addMatch});
}