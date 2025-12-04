import Fastify from "fastify";
import httpProxy from "@fastify/http-proxy";
import dotenv from "dotenv";
import fastifyJwt from "fastify-jwt";
import cors from '@fastify/cors'
import cookie from "fastify-cookie";

dotenv.config();
const fastify = Fastify({ logger: false });

fastify.register(cookie);

await fastify.register(cors, {
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true
})

fastify.register(fastifyJwt,
  {
    secret: process.env.JWT_SECRET,
    cookie: {
      cookieName: 'token',
      signed: false
    }
  }
);

fastify.decorate("authenticate", async function (request, reply) {
  try {
    if (request.url === "/auth/login" || request.url === "/users/register" ||
      request.url.startsWith("/socket.io")) {
      return;
    }
    if (request.method === 'OPTIONS') {
      return;
    }
    await request.jwtVerify();
  } catch (err) {
    console.log("Authentication error:", err);
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

fastify.register(httpProxy, {
  upstream: "http://localhost:3001",
  prefix: "/matches",
  rewritePrefix: '/matches'
});

fastify.register(httpProxy, {
  upstream: "http://localhost:3004",
  prefix: "/message",
  rewritePrefix: '/message'
});

fastify.register(httpProxy, {
  upstream: "http://localhost:3004",
  prefix: "/message/socket.io",
  rewritePrefix: '/socket.io',
  websocket: true
});

fastify.register(httpProxy, {
  upstream: "http://localhost:3005",
  prefix: "/online/socket.io",
  rewritePrefix: '/socket.io',
  websocket: true
});

fastify.register(httpProxy, {
  upstream: "http://localhost:3006",
  prefix: "/friend",
  rewritePrefix: '/friend'
});

fastify.register(httpProxy, {
  upstream: "http://localhost:3006",
  prefix: "/friend/socket.io",
  rewritePrefix: '/socket.io',
  websocket: true
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Gateway démarré sur ${address}`);
});
