import {  
    setup2FA,
    verify2FA
} from "../controller/2FAsetupController.js";

export default async function twoFactorRoutes(fastify) {
  const db = fastify.db;

  fastify.get("/users/2fa/setup", { handler: setup2FA });
  fastify.post("/users/2fa/verify", { handler: verify2FA });
}