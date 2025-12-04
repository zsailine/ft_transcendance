import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import friendRoutes from "./routes/friendRoutes.js";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifySocketIo from "fastify-socket.io";
import { socketAuth } from "./controller/socketController.js";

const userSocketMap = {};

dotenv.config();

const fastify = Fastify({ logger: true });

await fastify.register(fastifySocketIo, {
	cors: { origin: "*" }
});

await fastify.register(fastifyCookie);

await fastify.register(cors, {
	origin: "http://localhost:5173",
	methods: ['GET', 'POST', 'DELETE', 'PUT'],
	credentials: true
});

fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET });

fastify.register(friendRoutes);

fastify.ready().then(() => {
	fastify.io.use(socketAuth);

	fastify.io.on("connection", (socket) => {
		const username = socket.username;
		if (!userSocketMap[username]) {
			userSocketMap[username] = [];
		}
		userSocketMap[username].push(socket.id);

		socket.on("disconnect", () => {
			if (userSocketMap[username]) {
				const index = userSocketMap[username].indexOf(socket.id);
				if (index > -1) {
					userSocketMap[username].splice(index, 1);
				}
				if (userSocketMap[username].length === 0) {
					delete userSocketMap[username];
				}
			}
		});
	});
});

fastify.listen({ port: 3006 }, (err, address) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
	console.log(`🚀 Serveur démarré sur ${address}`);
});

export const getReceiverSocket = (username) => {
	return userSocketMap[username];
}

export { fastify };
