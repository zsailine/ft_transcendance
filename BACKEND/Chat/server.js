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
const userSocketMap = {};

await fastify.register(fastifySocketIo, {
	cors: { origin: "*" }
});

await fastify.register(fastifyCookie);

await fastify.register(cors, {
	origin: "http://localhost:5173",
	credentials: true
});

fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET });

fastify.register(chatRoutes);

fastify.ready().then(() => {
	fastify.io.use(socketAuth);
	
	fastify.io.on("connection", (socket) => {
		const userName = socket.username;
		userSocketMap[userName] = socket.id;
		fastify.io.emit("onlineUser", Object.keys(userSocketMap));
		socket.on("invite", (data) => {
			const receiverSocket = userSocketMap[data.toInvite]
			const room = data.room;
			const user = data.user;
			if (receiverSocket)
				fastify.io.to(receiverSocket).emit("join", {room, user});
		});
		socket.on("received", data => {
			const receiverSocket = userSocketMap[data];
			if (receiverSocket)
				fastify.io.to(receiverSocket).emit("received");
		})
		socket.on("disconnect", () => {
			delete userSocketMap[userName];
			fastify.io.emit("onlineUser", Object.keys(userSocketMap));
		});
	});
});

fastify.listen({ port: 3004 }, (err, address) => {
	if(err) {
		console.log(err);
		process.exit(1);
	}
	console.log(`🚀 Serveur démarré sur ${address}`);
});

export const getReceiverSocket = (username) => {
	return userSocketMap[username];
}

export { fastify };
