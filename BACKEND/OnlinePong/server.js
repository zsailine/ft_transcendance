"use strict"

import Fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import { initGame } from './logic/logic.js';
import { removeSocket } from './socket_utils.js';

const fastify = Fastify();

await fastify.register(fastifySocketIO, {
  cors: {
    origin: '*',
  },
});

function generateRoom() {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMBNOPQRSTUVWXYZ123456789"
  let i = 0;
  let result = "";
  while (i < 26) {
    result += alphabet[Math.floor(Math.random() * 61)];
    i++;
  }
  return (result);
}
fastify.ready().then(() => {
  // initGame(fastify.io);
  fastify.io.on("connection", process);
});

const AllMode = new Map();
const waitingPlayers = new Map();

function process(socket) {
  socket.on("quick", (username) => {
    if (AllMode.has(username)) {
      socket.emit("duplicate");
      return;
    }
    socket.username = username;

    AllMode.set(username, socket);
    waitingPlayers.set(username, socket);
1
    if (waitingPlayers.size >= 2) {
      const iterator = waitingPlayers.entries();
      const [ [username1, player1], [username2, player2] ] = [iterator.next().value, iterator.next().value];

      waitingPlayers.delete(username1);
      waitingPlayers.delete(username2);

      const roomName = generateRoom();
      player1.join(roomName);
      player2.join(roomName);

      player1.emit("role", "player1");
      player1.emit("opponent", username2);
      player2.emit("role", "player2");
      player2.emit("opponent", username1);
      player1.emit("ready");
      player2.emit("ready");

      initGame(fastify.io, roomName, player1.id, player2.id);
    }
  });
  
  socket.on("disconnect", () => {
    removeSocket(socket, AllMode, waitingPlayers);
  });
}

export const io = fastify.io;

fastify.listen({ port: 3005, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Serveur écoutant sur ${address}`);
});
