"use strict"
import { io } from "../server.js";
import { generateRoom } from "../socket_utils.js";
import { Tournament, TournamentMatch } from './ClassInterface.js';
const tournamentPlayers = [];
const tournamentLists = new Map();

let id = generateRoom();
const tournament = new Tournament(id, "my tournament", 2);
tournamentLists.set(id, tournament)
id = generateRoom()
const tournament1 = new Tournament(id, "test", 2);
tournamentLists.set(id, tournament1);

export default function processTournament(socket, AllMode) {

    socket.on("tournament", username => {

        if (AllMode.has(username)) {
            socket.emit("duplicate");
            return;
        }

        AllMode.set(username, socket);
        tournamentPlayers.push(socket);

        socket.username = username;
        socket.emit("list",
            Array.from(tournamentLists.values()).map(t => t.toJSON())
        );
    });


    socket.on("join tournament", id => {
        if (!tournamentLists.has(id)) socket.emit("error");
        const tournament = tournamentLists.get(id);
        if (!tournament.addPlayer(socket.username, socket)) socket.emit("error");
        if (tournament.currentPlayers === tournament.size)
            tournament.setStatus("full");
        const data = Array.from(tournamentLists.values()).map(t => t.toJSON());
        tournamentPlayers.forEach(s => {
            s.emit("list", data);
        });
    });

    socket.on("disconnect", () => {
        AllMode.delete(socket.username);
        const index = tournamentPlayers.indexOf(socket);
        if (index !== -1) tournamentPlayers.splice(index, 1);
        let listUpdated = false;
        tournamentLists.forEach((tournament) => {
            if (tournament.players.has(socket.username)) {
                tournament.removePlayer(socket.username);
                listUpdated = true;
            }
        });
        if (listUpdated) {
            const data = Array.from(tournamentLists.values()).map(t => t.toJSON());
            tournamentPlayers.forEach(s => {
                s.emit("list", data);
            });
        }
    });
}
