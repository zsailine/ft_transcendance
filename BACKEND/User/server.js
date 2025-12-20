import Fastify from "fastify";
import Database from "better-sqlite3";
import userRoutes from "./routes/userRoutes.js";
import matchesRoutes from "./routes/matchesRoutes.js";
import twoFactorRoutes from "./routes/2FARoutes.js";
import cors from '@fastify/cors'
import fastifyMultipart from "@fastify/multipart";
import axios from "axios";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastifySocketIo from "fastify-socket.io";
import dotenv from "dotenv";
import { socketAuth } from "./controller/socketController.js";

dotenv.config();
const userSocketMap = {};
const fastify = Fastify({ logger: false });

await fastify.register(fastifySocketIo, {
	cors: { origin: "*" }
});

await fastify.register(fastifyCookie);

await fastify.register(cors, {
  origin: "http://localhost:5173",
  credentials: true
})

fastify.register(fastifyJwt , 
  {
    secret : process.env.JWT_SECRET,
    cookie: {
      cookieName: 'token',
      signed: false
    } 
  }
);

const axiosInstance = axios.create({
  baseURL: "http://localhost:3002",
  withCredentials: true,
  timeout: 1000,
});

fastify.decorate("db", new Database("./data/users.db"));
fastify.decorate("axios", axiosInstance);

fastify.register(fastifyMultipart,{
  attachFieldsToBody : true
});
// Route temporaire pour reset le 2FA
fastify.register(userRoutes);
fastify.register(matchesRoutes);
fastify.register(twoFactorRoutes);

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

fastify.addHook('onSend', (request, reply, payload, next) => {
  next();
});

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Serveur démarré sur ${address}`);
});

export const getReceiverSocket = (username) => {
	return userSocketMap[username];
}

export { fastify };
