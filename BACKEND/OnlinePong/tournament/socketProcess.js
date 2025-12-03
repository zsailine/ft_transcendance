"use strict"

export default function processTournament(socket, tournament) {
	socket.on("tournament", username => {
        socket.username = username;
        socket.emit("list", [tournament]);
    });
}