export function removeSocket(socket, AllMode, waitingPlayers) {
    if (socket.username && AllMode.has(socket.username)) {
        AllMode.delete(socket.username);
    }
    if (socket.username && waitingPlayers.has(socket.username)) {
        waitingPlayers.delete(socket.username);
    }
}

export function generateRoom() {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMBNOPQRSTUVWXYZ123456789"
  let i = 0;
  let result = "";
  while (i < 26) {
    result += alphabet[Math.floor(Math.random() * 61)];
    i++;
  }
  return (result);
}