import Fastify from "fastify";
import axios from "axios";
import fastifyCookie from "fastify-cookie";
import authRoutes from "./routes/authRoutes.js";
import authGoogleRoutes from "./routes/authGoogleRoutes.js";
import dotenv from "dotenv";
import fastifyJwt from "@fastify/jwt";
import cors from '@fastify/cors'

dotenv.config();
const fastify = Fastify({ logger: true });

await fastify.register(cors, {
    origin: "https://localhost:8443",
    credentials: true
})

await fastify.register(fastifyCookie);

const axiosInstance = axios.create({
baseURL: "http://userservice:3001",
timeout: 1000,
});


fastify.decorate("axios", axiosInstance);

fastify.register(fastifyJwt , {secret : process.env.JWT_SECRET});

fastify.register(authGoogleRoutes);

fastify.register(authRoutes);

fastify.listen({ port: 3002, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Serveur démarré sur ${address}`);
});





