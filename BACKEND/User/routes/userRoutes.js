import {  createUser,
          getAllUsers,
          getAvatar,
          getUserByUsername,
          updateUser,
          updateColor,
          getId
} from "../controller/userController.js";

export default async function userRoutes(fastify) {
  const db = fastify.db;

  fastify.get("/users/all", { handler: getAllUsers });

  fastify.get("/users/:username", { handler: getUserByUsername });

  fastify.get("/users/:username/avatar", { handler: getAvatar });

  fastify.get("/users/:username/id", { handler: getId });

  fastify.post("/users/register", { handler: createUser });

  fastify.post("/users/update" , { handler: updateUser });

  fastify.post("/users/:username/updateColor" , { handler: updateColor });
}