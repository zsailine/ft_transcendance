import { loggedUser, verify, logout } from "../controller/authController.js";


export default async function authRoutes(fastify){
  fastify.post("/auth/", { handler : loggedUser } );
  fastify.post("/auth/logout" , { handler : logout });
  fastify.get("/auth/me" , { handler : verify });
}