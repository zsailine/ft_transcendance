"use strict"

import Fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import { removeSocket, generateQuick, createRoom, joinRoom, generateMultiplayer, generateRoom } from './socket_utils.js';
import { Tournament, TournamentMatch } from './tournament/ClassInterface.js';
import processTournament from './tournament/socketProcess.js';
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
    });
    socket.on("multiplayer", (username) => {
        generateMultiplayer(AllMode, waitingMultiplayers, socket, username);
    });
    socket.on("disconnect", () => {
        removeSocket(socket, AllMode, waitingPlayers, privateRooms, waitingMultiplayers);
    });
    processTournament(socket, tournament);
}
const id = generateRoom();
console.log("the id is "+ id);
const tournament = new Tournament(id, "my tournament", 4);

tournament.addPlayer("zo", 879797);
tournament.addPlayer("zos", 879797);
// console.log("tournamnet id is ", tournament);
// if (tournament.addPlayer("zoa", 46546546) === false)
//     console.log("error max");

export const io = fastify.io;

fastify.listen({ port: 3005, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`Serveur écoutant sur ${address}`);
});
