import { loggedUser } from "../controller/authController.js";


export default async function authRoutes(fastify){
  fastify.post("/auth/login",{ handler : loggedUser } );
}