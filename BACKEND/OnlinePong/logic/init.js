import { initGame } from './start.js';
import { startMulti } from './multi.js';
import { io } from '../server.js';

export async function init(roomName, player1, username1, player2, username2, activeGames, userRooms) {
    const random = Math.random() < 0.5;

    const p1 = random ? player1 : player2;
    const u1 = random ? username1 : username2;

    const p2 = random ? player2 : player1;
    const u2 = random ? username2 : username1;

    p1.join(roomName);
    p2.join(roomName);

    p1.emit("role", "player1");
    p1.emit("opponent", u2);

    p2.emit("role", "player2");
    p2.emit("opponent", u1);

    p1.emit("ready");
    p2.emit("ready");
    const handleGameEnd = (room, u1, u2) => {
        console.log(`Partie terminée dans la room ${room}`);
        activeGames.delete(room);
        userRooms.delete(u1);
        userRooms.delete(u2);
    };

    const gameController = await initGame(io, roomName, username1, username2, handleGameEnd);

    activeGames.set(roomName, gameController);
    userRooms.set(username1, roomName);
    userRooms.set(username2, roomName);
}

export function initMulti(roomName, player1, username1, player2, username2, player3, username3, player4, username4) {
    let players = [
        { socket: player1, username: username1 },
        { socket: player2, username: username2 },
        { socket: player3, username: username3 },
        { socket: player4, username: username4 }
    ];

    for (let i = players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
    }

    const p1 = players[0].socket;
    const u1 = players[0].username;
    const p2 = players[1].socket;
    const u2 = players[1].username;
    const p3 = players[2].socket;
    const u3 = players[2].username;
    const p4 = players[3].socket;
    const u4 = players[3].username;

    p1.join(roomName);
    p2.join(roomName);
    p3.join(roomName);
    p4.join(roomName);

    const allPlayersNames = [u1, u2, u3, u4];

    p1.emit("role", "player1");
    p1.emit("players_info", allPlayersNames);

    p2.emit("role", "player2");
    p2.emit("players_info", allPlayersNames);

    p3.emit("role", "player3");
    p3.emit("players_info", allPlayersNames);

    p4.emit("role", "player4");
    p4.emit("players_info", allPlayersNames);

    p1.emit("ready");
    p2.emit("ready");
    p3.emit("ready");
    p4.emit("ready");
    startMulti(io, roomName, p1.id, p2.id, p3.id, p4.id);
}
