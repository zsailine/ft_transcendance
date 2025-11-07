import Fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import { initGame } from './logic.js';

const fastify = Fastify();

await fastify.register(fastifySocketIO, {
  cors: {
    origin: '*',
  },
});

function generateRoom()
{
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMBNOPQRSTUVWXYZ123456789"
  let i = 0;
  let result = "";
  while (i < 26)
  {
    result += alphabet[ Math.floor(Math.random() * 61)];
    i++;
  }
  return (result);
}
fastify.ready().then(() => {
  // initGame(fastify.io);
  fastify.io.on("connection", process);
});

let waitingPlayers = [];

function process(socket) {
  waitingPlayers.push(socket);
  if (waitingPlayers.length >= 2) {
    const player1 = waitingPlayers.shift();
    const player2 = waitingPlayers.shift();

    const roomName = generateRoom();
    player1.join(roomName);
    player2.join(roomName);

    player1.emit("role", "player1");
    player2.emit("role", "player2");
    player1.emit("ready");
    player2.emit("ready");

    initGame(fastify.io, roomName, player1.id, player2.id);
  }
  socket.on("disconnect", () => {
    waitingPlayers = waitingPlayers.filter(s => s !== socket);
  });
}

export const io = fastify.io;

fastify.listen({ port: 3005, host:"0.0.0.0" }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Serveur écoutant sur ${address}`);
});
