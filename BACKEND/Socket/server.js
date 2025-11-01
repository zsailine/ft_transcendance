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

let player1 = null;
let player2 = null;

function process(socket)
{
  if (!player1)
    player1 = socket;
  else
    player2 = socket;
  socket.on("disconnect", () => {
    if (player1 === socket)
      player1 = null;
    else if (player2 === socket)
        player2 = null;
  });
  if (player1 && player2)
  {
    const roomName = generateRoom();
    player1.join(roomName);
    player2.join(roomName);
    console.log("playe1 is"+player1.id);
    console.log("playe2 is"+player2.id);
    player1.emit("role", "player1");
    player2.emit("role", "player2");
    player1.emit("ready");
    player2.emit("ready");
    initGame(fastify.io, roomName, player1.id, player2.id);
    player1 = null;
    player2 = null;
  }
}

export const io = fastify.io;

fastify.listen({ port: 3000, host:"0.0.0.0" }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Serveur écoutant sur ${address}`);
});
