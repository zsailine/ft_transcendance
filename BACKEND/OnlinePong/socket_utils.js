import { init } from "./logic/init.js";

export function removeSocket(socket, AllMode, waitingPlayers, privateRoom) {
    if (!socket.username)
        return;
    console.log("miditra");
    if (AllMode.has(socket.username)) {
        AllMode.delete(socket.username);
    }
    if (waitingPlayers.has(socket.username)) {
        waitingPlayers.delete(socket.username);
    }
    for (const [room, info] of privateRoom.entries()) {
        if (info.owner === socket) {
            privateRoom.delete(room);
        }
    }
}

export function generateRoom() {
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMBNOPQRSTUVWXYZ123456789"
    let i = 0;
    let result = "";
    while (i < 26) {
        const rand = Math.floor(Math.random() * alphabet.length);
        i++;
    }
    return (result);
}

export function generateQuick(AllMode, waitingPlayers, socket, username) {
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
        const [[username1, player1], [username2, player2]] = [iterator.next().value, iterator.next().value];

        waitingPlayers.delete(username1);
        waitingPlayers.delete(username2);
        const roomName = generateRoom();

        init(roomName, player1, username1, player2, username2);
    }
}

export function createRoom(AllMode, privateRooms, socket, data) {
    const { username, room } = data;
    if (AllMode.has(username)) {
        socket.emit("duplicate");
        return;
    }
    if (privateRooms.has(room))
    {
        socket.emit("exist");
        return ;
    }
    socket.username = username;
    AllMode.set(username, socket);
    privateRooms.set(room, {
        owner: socket,
        username,
    });

}

export function joinRoom(AllMode, privateRooms, socket, data) {
    const { username, room } = data;

    if (AllMode.has(username)) {
        socket.emit("duplicate");
        return;
    }
    const roomData = privateRooms.get(room);
    if (!roomData) {
        socket.emit("don't exist");
        return;
    }

    const { username: username1, owner: player1 } = roomData;
    const username2 = username;
    const player2 = socket;
    privateRooms.delete(room);

    init(room, player1, username1, player2, username2);
}