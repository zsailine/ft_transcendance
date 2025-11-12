export function removeSocket(socket, AllMode, waitingPlayers) {
    if (socket.username && AllMode.has(socket.username)) {
        AllMode.delete(socket.username);
    }
    if (socket.username && waitingPlayers.has(socket.username)) {
        waitingPlayers.delete(socket.username);
    }
}