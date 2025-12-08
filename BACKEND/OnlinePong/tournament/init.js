"use strict"
import { io } from "../server.js";

function generateMatches(tournament) {
    const players = Array.from(tournament.players.keys());

    if (players.length < 2) {
        return false;
    }

    tournament.matches = [];
    let round = 1;
    let matchId = 1;
    players.sort(() => Math.random() - 0.5);
    for (let i = 0; i < players.length; i += 2) {
        const player1 = players[i];
        const player2 = players[i + 1] ?? null;

        const match = new TournamentMatch(
            matchId++,
            round,
            player1,
            player2
        );

        tournament.addMatch(match);
    }

    return true;
}


export default function initTournament(tournament) {
    io.to(tournament.id).emit("started");
    setTimeout(() => {
        const players = Array.from(tournament.players.keys());
        players.sort(() => Math.random() - 0.5);
        io.to(tournament.id).emit("matchmaking", players);
        for (let i = 10; i > 0; i--) {
            for (let i = 10; i > 0; i--) {
                setTimeout(() => {
                    io.to(tournament.id).emit("count", `Match starts in ${i} seconds`);
                }, (11 - i) * 1000);
            }
        }
        setTimeout(() => {
            io.to(tournament.id).emit("count", "GO!");
        }, 11 * 1000);
    }, 500);
}