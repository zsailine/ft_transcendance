"use strict"
import { io } from "../server.js";
import { generateRoom } from "../socket_utils.js";
import { Tournament, TournamentMatch } from './ClassInterface.js';
const tournamentPlayers = [];
const tournamentLists = new Map();

function sendTournament() {
    const data = Array.from(tournamentLists.values()).map(t => t.toJSON());
    tournamentPlayers.forEach(s => {
        s.emit("list", data);
    });
}
export default function processTournament(socket, AllMode) {

    socket.on("tournament", username => {

        if (AllMode.has(username)) {
            socket.emit("duplicate");
            return;
        }

        AllMode.set(username, socket);
        tournamentPlayers.push(socket);

        socket.username = username;
        const data = Array.from(tournamentLists.values()).map(t => t.toJSON());
        socket.emit("list", data);
    });


    socket.on("join tournament", id => {
        if (!tournamentLists.has(id)) socket.emit("error");
        const tournament = tournamentLists.get(id);
        if (!tournament.addPlayer(socket.username, socket.username)) socket.emit("error");
        if (tournament.currentPlayers === tournament.size)
            tournament.setStatus("full");
        socket.emit("joined", tournament.toJSON());
        sendTournament()
    });

    socket.on("create tournament", data => {
        let id = generateRoom();
        const tournament = new Tournament(id, data.name, data.maxPlayers);
        tournamentLists.set(id, tournament);
        sendTournament();
        socket.emit("created", id);
    })
    socket.on("disconnect", () => {
        AllMode.delete(socket.username);
        const index = tournamentPlayers.indexOf(socket);
        if (index !== -1) tournamentPlayers.splice(index, 1);
        let listUpdated = false;
        tournamentLists.forEach((tournament) => {
            if (tournament.players.has(socket.username)) {
                tournament.removePlayer(socket.username);
                if (tournament.currentPlayers === 0)
                    tournamentLists.delete(tournament.id);
                listUpdated = true;
            }
        });
        if (listUpdated) {
            sendTournament();
        }
    });
}
