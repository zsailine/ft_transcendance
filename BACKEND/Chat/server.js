import Fastify from "fastify";
import chatRoutes from "./routes/chatRoutes.js";
import cookie from "@fastify/cookie";
import cors from "cors";
import Database from "better-sqlite3";

const fastify = Fastify({ logger: true });  

await fastify.register(cors, {
  origin: "*",
  allowedHeaders: ["Authorization","Content-Type"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
})

fastify.register(chatRoutes);

fastify.listen({ port: 3004 }, (err, address) => {
	if(err) {
		console.log(err);
		process.exit(1);
	}
	console.log(`🚀 Serveur démarré sur ${address}`);
});
