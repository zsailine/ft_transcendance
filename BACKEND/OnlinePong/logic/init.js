import { initGame } from './logic.js';
import { io } from '../server.js';

export function init(roomName, player1, username1, player2, username2) {
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
    console.log('the socket id of p1 ' + p1.id);
    console.log('the socket id pf p2 ' + p2.id);
    initGame(io, roomName, p1.id, p2.id);
}