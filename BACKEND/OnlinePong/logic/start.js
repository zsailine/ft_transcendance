"use strict";

import axios from "axios";

const board = {
  width: 0,
  height: 0
}
export async function initGame(io, roomName, user1Id, user2Id, onEnd) {
  let gameOver = false;

  let players = {
    player1: { userId: user1Id, socketId: null, socket: null },
    player2: { userId: user2Id, socketId: null, socket: null }
  };
  const debut = Date.now();
  resizeBoard();
  let paddle1Speed = board.height / 250;
  let paddle2Speed = board.height / 250;
  const removeListeners = (socket) => {
    socket.removeAllListeners("arrowUp");
    socket.removeAllListeners("arrowDown");
    socket.removeAllListeners("arrowUpRelease");
    socket.removeAllListeners("arrowDownRelease");
    socket.removeAllListeners("disconnect");
  }
  const attachListeners = (socket, role) => {
    removeListeners(socket);
    socket.data.gameRole = role;

    socket.on("arrowUp", () => {
      if (gameOver) return;
      if (role === "player1") paddle1Direction = -1;
      else paddle2Direction = -1;
    });

    socket.on("arrowDown", () => {
      if (gameOver) return;
      if (role === "player1") paddle1Direction = 1;
      else paddle2Direction = 1;
    });

    socket.on("arrowUpRelease", () => {
      if (role === "player1") paddle1Direction = 0;
      else paddle2Direction = 0;
    });

    socket.on("arrowDownRelease", () => {
      if (role === "player1") paddle1Direction = 0;
      else paddle2Direction = 0;
    });
    socket.on("speed", (speed) => {
      if (gameOver) return;
      if (role === "player1") paddle1Speed = board.height / speed;
      else paddle2Speed = board.height / speed;
    });
    socket.on("disconnect", () => {
      if (role === "player1")
        players.player1.socket = null;
      else
        players.player2.socket = null;
    });
  };

  const sockets = await io.in(roomName).fetchSockets();
  sockets.forEach(socket => {
    if (socket.username === user1Id) {
      players.player1.socketId = socket.id;
      players.player1.socket = socket;
      attachListeners(socket, "player1");
    }
    else if (socket.username === user2Id) {
      players.player2.socketId = socket.id;
      players.player2.socket = socket;
      attachListeners(socket, "player2");
    }
  });

  io.to(roomName).emit("start");

  let paddle1 = {
    width: board.width * 0.02,
    height: board.height * 0.15,
    x: board.width * 0.04,
    y: board.height / 2 - board.height * 0.075,
    Direction: 0,
    Score: 0
  };

  let paddle2 = {
    width: board.width * 0.02,
    height: board.height * 0.15,
    x: board.width - board.width * 0.06,
    y: board.height / 2 - board.height * 0.075,
    Direction: 0,
    Score: 0
  };
  const date = new Date();
  const paddle1Stats = { returns: 0, maxCombo: 0, combo: 0 };
  const paddle2Stats = { returns: 0, maxCombo: 0, combo: 0 };
  let paddle1Score = 0;
  let paddle2Score = 0;
  let ballSpeed = 0;
  let ballX;
  let ballY;
  let ballXDirection;
  let ballYDirection;
  let intervalID;
  let ballRadius = board.width * 0.0125;
  let paddleSpeed = board.height / 200;

  function resizeBoard() {
    board.width = 1600;
    board.height = 900;
  }

  function createBall() {
    ballSpeed = board.width * 0.002;

    const minY = board.height / 3;
    const maxY = (board.height * 3) / 4;
    ballY = minY + Math.random() * (maxY - minY);
    ballX = board.width / 2;

    const minAngle = 30 * (Math.PI / 180);
    const maxAngle = 50 * (Math.PI / 180);
    const direction = Math.random() > 0.5 ? 1 : -1;

    const angle = minAngle + Math.random() * (maxAngle - minAngle);

    ballXDirection = Math.cos(angle) * direction;
    ballYDirection = Math.sin(angle);
  }

  let paddle1Direction = 0;
  let paddle2Direction = 0;

  function movePaddles() {
    if (paddle1Direction !== 0) {
      let newY = paddle1.y + paddle1Speed * paddle1Direction;
      paddle1.y = Math.max(0, Math.min(newY, board.height - paddle1.height));
      io.to(roomName).emit("paddle1", paddle1.y);
    }
    if (paddle2Direction !== 0) {
      let newY = paddle2.y + paddle2Speed * paddle2Direction;
      paddle2.y = Math.max(0, Math.min(newY, board.height - paddle2.height));
      io.to(roomName).emit("paddle2", paddle2.y);
    }
  }
  function add(board) {
    if (ballSpeed < board.width * 0.006) {
      ballSpeed += board.width * 0.0005;
    }
  }

  const checkPaddleCollision = (paddle, paddleStats) => {
    const left = paddle.x;
    const right = paddle.x + paddle.width;
    const top = paddle.y;
    const bottom = paddle.y + paddle.height;
    const centerX = left + paddle.width * 0.5;
    const centerY = top + paddle.height * 0.5;
    const closestX = Math.max(left, Math.min(ballX, right));
    const closestY = Math.max(top, Math.min(ballY, bottom));
    const dx = ballX - closestX;
    const dy = ballY - closestY;

    if (dx * dx + dy * dy >= ballRadius * ballRadius) return;

    const overlapX =
      (paddle.width * 0.5 + ballRadius) - Math.abs(ballX - centerX);
    const overlapY =
      (paddle.height * 0.5 + ballRadius) - Math.abs(ballY - centerY);

    if (overlapY < overlapX) {
      ballYDirection = -ballYDirection;

      ballY = (ballY < centerY)
        ? top - ballRadius
        : bottom + ballRadius;
      ballY = Math.max(ballRadius, Math.min(ballY, board.height - ballRadius));
    }
    else {
      ballXDirection = -ballXDirection;
      paddleStats.returns++;
      paddleStats.combo++;
      paddleStats.maxCombo = Math.max(paddleStats.combo, paddleStats.maxCombo),
        add(board);

      ballX = (ballX < centerX)
        ? left - ballRadius
        : right + ballRadius;
    }
  };


  function moveBall() {
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;

    if (ballSpeed === 0) {
      io.to(roomName).emit("update", {
        ballX: 1700, ballY: 1000,
        paddle1Y: paddle1.y,
        paddle2Y: paddle2.y
      });
      return;
    }
    if (ballY - ballRadius < 0) {
      ballYDirection = -ballYDirection;
      ballY = 0 + ballRadius;
    }
    if (ballY + ballRadius > board.height) {
      ballYDirection = -ballYDirection;
      ballY = board.height - ballRadius;
    }
    checkPaddleCollision(paddle1, paddle1Stats);
    checkPaddleCollision(paddle2, paddle2Stats);

    if (ballX + ballRadius < 0) {
      paddle1Stats.combo = 0;
      paddle2Score++;
      resetBall();
    } else if (ballX - ballRadius > board.width) {
      paddle2Stats.combo = 0;
      paddle1Score++;
      resetBall();
    }
    io.to(roomName).emit("update", {
      ballX, ballY,
      paddle1Y: paddle1.y,
      paddle2Y: paddle2.y
    });
  }

  async function addMatch(winner) {
    const fin = Date.now();
    const duration = fin - debut;
    const body = {
      player1: user1Id,
      player2: user2Id,
      stats_p1: {
        returns: paddle1Stats.returns,
        maxCombo: paddle1Stats.maxCombo ?? 0,
      },
      stats_p2: {
        returns: paddle2Stats.returns,
        maxCombo: paddle2Stats.maxCombo ?? 0,
      },
      score_p1: paddle1Score,
      score_p2: paddle2Score,
      winner: winner === "player1" ? user1Id : user2Id,
      played_at: date,
      duration: Math.floor(duration / 1000)
    };
    await axios.post('http://localhost:3001/matches/add', body)
      .then(() => {
      })
      .catch((error) => {
        console.error(error);
      });
  }
  function checkWinner() {
    if (paddle1Score === 5 || paddle2Score === 5) {
      gameOver = true;
      stopGameLoop();
      const winner =
        paddle1Score === 5
          ? "player1"
          : "player2";
      io.to(roomName).emit("finish", winner);
      addMatch(winner);
      if (onEnd) onEnd(roomName, user1Id, user2Id);
    }
  }

  function resetBall() {
    io.to(roomName).emit("score", { paddle1Score, paddle2Score });
    ballSpeed = 0;
    setTimeout(() => {
      createBall();
    }, 500);
    checkWinner();
  }

  function startGameLoop() {
    intervalID = setInterval(() => {
      movePaddles();
      moveBall();
    }, 10);
  }

  function stopGameLoop() {
    clearInterval(intervalID);
  }
  setTimeout(() => {
    createBall();
  }, 1000);
  startGameLoop();
  return {
    reconnectPlayer: (userId, newSocket) => {
      let role = null;
      if (userId === players.player1.userId) {
        newSocket.emit("role", "player1");
        newSocket.emit("opponent", players.player2.userId);
        role = "player1";
      }
      else if (userId === players.player2.userId) {
        newSocket.emit("role", "player2");
        newSocket.emit("opponent", players.player1.userId);
        role = "player2";
      }
      if (role) {
        if (players[role].socket) {
          removeListeners(players[role].socket);
          players[role].socket.emit("removed");
        }
        players[role].socket = newSocket;
        players[role].socketId = newSocket.id;
        attachListeners(newSocket, role);

        newSocket.emit("ready");
        setTimeout(() => {
          newSocket.join(roomName);
          newSocket.emit("score", { paddle1Score, paddle2Score });
          newSocket.emit("paddle2", paddle2.y);
          newSocket.emit("paddle1", paddle1.y)
        }, 500)

        return true;
      }
      return false;
    },
    stop: () => stopGameLoop()
  };
}
