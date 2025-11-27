import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import friendRoutes from "./routes/friendRoutes.js";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import axios from "axios";

dotenv.config();

const fastify = Fastify({ logger: true });

await fastify.register(fastifyCookie);

await fastify.register(cors, {
	origin: "http://localhost:8080",
	methods: ['GET', 'POST', 'DELETE', 'PUT'],
	credentials: true
});

fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET });

fastify.register(friendRoutes);

fastify.listen({ port: 3006, host: '0.0.0.0' }, (err, address) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
	console.log(`🚀 Serveur démarré sur ${address}`);
});

export { fastify };
