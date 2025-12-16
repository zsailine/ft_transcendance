import { addMatch, getStats, getuserMatches, getLeaderboard } from "../controller/matchesController.js";

export default async function matchesRoutes(fastify) {
	const db = fastify.db;

	fastify.get("/matches/:username", {handler:  getuserMatches});

	fastify.get("/matches/stats/:username", {handler:  getStats});

	fastify.get("/matches/leaderboard", {handler: getLeaderboard});

	fastify.post("/matches/add", {handler: addMatch});
}