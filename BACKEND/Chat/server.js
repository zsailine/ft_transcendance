import Fastify from "fastify";
import chatRoutes from "./routes/chatRoutes.js";
import cors from "@fastify/cors";

const fastify = Fastify({ logger: true });  

await fastify.register(cors, {
	origin: "*",
	allowedHeaders: ["Authorization","Content-Type"],
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

fastify.register(chatRoutes);

fastify.listen({ port: 3004 }, (err, address) => {
	if(err) {
		console.log(err);
		process.exit(1);
	}
	console.log(`🚀 Serveur démarré sur ${address}`);
});
