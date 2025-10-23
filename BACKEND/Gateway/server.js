import Fastify from "fastify";
import httpProxy from "@fastify/http-proxy";
import dotenv from "dotenv";
import fastifyJwt from "fastify-jwt";

dotenv.config();
const fastify = Fastify({ logger: true });  

fastify.register(fastifyJwt , {secret : process.env.JWT_SECRET});

fastify.decorate("authenticate", async function(request, reply) {
  try {
    console.log(request.url)
    if (request.url.startsWith("/auth") || request.url === "/users/register") {
      console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEE")
      return;
    }
    await request.jwtVerify();
  } catch (err) {
    console.log("*****************************\n")
    reply.code(401).send({ error: "Unauthorized" });
  }
});

fastify.addHook("onRequest", fastify.authenticate);

fastify.register(httpProxy, {
  upstream: "http://localhost:3002",
  prefix: "/auth",
  rewritePrefix: '/auth'
});

fastify.register(httpProxy, {
  upstream: "http://localhost:3001",
  prefix: "/users",
  rewritePrefix: '/users'
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Gateway démarré sur ${address}`);
});
