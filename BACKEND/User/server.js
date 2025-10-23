
import Fastify from "fastify";
import Database from "better-sqlite3";
import userRoutes from "./routes/userRoutes.js";

const fastify = Fastify({ logger: true });

fastify.decorate("db", new Database("./data/users.db"));

fastify.register(userRoutes);

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Serveur démarré sur ${address}`);
});