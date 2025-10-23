import { loggedUser, verify } from "../controller/authController.js";


export default async function authRoutes(fastify){
  fastify.post("/auth/login", { handler : loggedUser } );
  fastify.get("/auth/me" , { handler : verify });
}