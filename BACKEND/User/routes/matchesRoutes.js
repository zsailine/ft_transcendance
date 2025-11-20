import { addMatch, getuserMatches } from "../controller/matchesController.js";

export default async function matchesRoutes(fastify) {
	const db = fastify.db;

	fastify.get("/matches/:username", {handler:  getuserMatches});

	fastify.post("/matches/add", {handler: addMatch});
}