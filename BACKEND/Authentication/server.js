import Fastify from "fastify";
import axios from "axios";
import fastifyCookie from "fastify-cookie";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import fastifyJwt from "@fastify/jwt";
import cors from '@fastify/cors'

dotenv.config();
const fastify = Fastify({ logger: false });

await fastify.register(cors, {
    origin: "http://localhost:5173",
    credentials: true
})

await fastify.register(fastifyCookie);

const axiosInstance = axios.create({
baseURL: "http://localhost:3001",
timeout: 1000,
});



fastify.decorate("axios", axiosInstance);

fastify.register(fastifyJwt , {secret : process.env.JWT_SECRET});

fastify.register(authRoutes);

fastify.listen({ port: 3002 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Serveur démarré sur ${address}`);
});





