import { createUser , getAllUsers , getUserByUsername} from "../controller/userController.js";

export default async function userRoutes(fastify) {
  const db = fastify.db;

  fastify.get("/users", { handler: getAllUsers });

  fastify.get("/users/:username", { handler: getUserByUsername });

  fastify.post("/users", { handler: createUser });
}