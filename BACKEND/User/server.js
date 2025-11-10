import Fastify from "fastify";
import Database from "better-sqlite3";
import userRoutes from "./routes/userRoutes.js";
import cors from '@fastify/cors'
import fastifyMultipart from "@fastify/multipart";


const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: "*",
  allowedHeaders: ["Authorization","Content-Type"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
})

fastify.decorate("db", new Database("./data/users.db"));

fastify.register(fastifyMultipart,{
  attachFieldsToBody : true
});

fastify.register(userRoutes);

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