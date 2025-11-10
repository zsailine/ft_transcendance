import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import friendRoutes from "./routes/friendRoutes.js";

dotenv.config();

const fastify = Fastify({ logger: false });

await fastify.register(cors, {
	origin: "*",
	allowedHeaders: ["Authorization","Content-Type"],
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

fastify.register(friendRoutes);

fastify.listen({ port: 3006 }, (err, address) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
	console.log(`🚀 Serveur démarré sur ${address}`);
});

export { fastify };
