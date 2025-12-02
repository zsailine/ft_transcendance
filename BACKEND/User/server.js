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
import dotenv from "dotenv";


const fastify = Fastify({ logger: true });

await fastify.register(fastifyCookie);

await fastify.register(cors, {
    origin: "http://localhost:8080",
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



fastify.addHook('onSend', (request, reply, payload, next) => {
  next();
});

fastify.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Serveur démarré sur ${address}`);
});