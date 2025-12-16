"use strict"

import Fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import { removeSocket, generateQuick, createRoom, joinRoom, generateMultiplayer } from './socket_utils.js';

const fastify = Fastify();

await fastify.register(fastifySocketIO, {
    cors: {
        origin: '*',
    },
});

fastify.ready().then(() => {
    fastify.io.on("connection", process);
});

const AllMode = new Map();
const waitingPlayers = new Map();
const privateRooms = new Map();
const waitingMultiplayers = new Map();

function process(socket) {
    socket.on("quick", (username) => {
        generateQuick(AllMode, waitingPlayers, socket, username);
    });
    socket.on("invite", (data) => {
        if (privateRooms.has(data.room))
            joinRoom(AllMode, privateRooms, socket, data);
        else
            createRoom(AllMode, privateRooms, socket, data);
    })
    socket.on("multiplayer", (username) => {
        generateMultiplayer(AllMode, waitingMultiplayers, socket, username);
    })
    socket.on("disconnect", () => {
        removeSocket(socket, AllMode, waitingPlayers, privateRooms, waitingMultiplayers);
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
