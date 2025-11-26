import {  
    setup2FA
} from "../controller/2FAsetupController.js";

export default async function twoFactorRoutes(fastify) {
  const db = fastify.db;

  fastify.get("/users/2fa/setup", { handler: setup2FA });
}