import Fastify from "fastify";
import chatRoutes from "./routes/chatRoutes.js";
import cors from "@fastify/cors";
import fastifySocketIo from "fastify-socket.io";
import { socketAuth } from "./controller/socketController.js";
import dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({
	logger: true,
	bodyLimit: 10 * 1024 * 1024 });

 const userSocketMap = {};

await fastify.register(fastifySocketIo, {
	cors: { origin: "*" }
});

await fastify.register(cors, {
	origin: "*",
	allowedHeaders: ["Authorization","Content-Type"],
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

fastify.register(chatRoutes);

fastify.ready().then(() => {
	fastify.io.use(socketAuth);
	
	fastify.io.on("connection", (socket) => {
		console.log("A User connected", socket.username);
		const userName = socket.username;
		userSocketMap[userName] = socket.id;
		fastify.io.emit("onlineUser", Object.keys(userSocketMap));
	
		socket.on("disconnect", () => {
			console.log("A User disconnected", socket.username);
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
