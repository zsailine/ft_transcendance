import Fastify from "fastify";
import chatRoutes from "./routes/chatRoutes.js";
import cors from "@fastify/cors";
import fastifySocketIo from "fastify-socket.io";
import { socketAuth } from "./controller/socketController.js";
import dotenv from "dotenv";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";

dotenv.config();

const fastify = Fastify({ logger: false });
export const userSocketMap = {};

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

fastify.register(chatRoutes);

fastify.ready().then(() => {
	fastify.io.use(socketAuth);

	fastify.io.on("connection", (socket) => {
		const userName = socket.username;
		if (!userSocketMap[userName]) {
			userSocketMap[userName] = [];
		}
		userSocketMap[userName].push(socket.id);
		fastify.io.emit("onlineUser", Object.keys(userSocketMap));

		socket.on("invite", (data) => {
			const receiverSockets = userSocketMap[data.toInvite];
			const room = data.room;
			const user = data.user;

			if (receiverSockets && receiverSockets.length > 0) {
				// receiverSockets.forEach(socketId => {
					fastify.io.to(receiverSockets).emit("join", { room, user });
				// });
			}
		});
		socket.on("received", data => {
			const receiverSockets = userSocketMap[data];
			if (receiverSockets && receiverSockets.length > 0) {
				// receiverSockets.forEach(socketId => {
					fastify.io.to(receiverSockets).emit("received");
				// });
			}
		})

		socket.on("disconnect", () => {
			if (userSocketMap[userName]) {
				const index = userSocketMap[userName].indexOf(socket.id);
				if (index > -1) {
					userSocketMap[userName].splice(index, 1);
				}
				if (userSocketMap[userName].length === 0) {
					delete userSocketMap[userName];
				}
			}

			fastify.io.emit("onlineUser", Object.keys(userSocketMap));
		});
	});
});

fastify.listen({ port: 3004 }, (err, address) => {
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
