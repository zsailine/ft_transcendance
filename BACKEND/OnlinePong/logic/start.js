"use strict";
import fastifySocketIO from 'fastify-socket.io';
import { generateRoom } from '../socket_utils.js';
const board = {
  width: 0,
  height: 0
}

export async function initGame(io, roomName, player1Id, player2Id) {
  let gameOver = false;
  let paddle1Speed = board.height / 250;
  let paddle2Speed = board.height / 250;
  io.in(roomName).fetchSockets().then((sockets) => {
    sockets.forEach((socket) => {
      if (socket.data.listenersAttached) return;
      socket.data.listenersAttached = true;

      socket.on("arrowUp", () => {
        if (gameOver) return;
        if (socket.id === player1Id) {
          paddle1Direction = -1;
        } else {
          paddle2Direction = -1;
        }
      });

      socket.on("arrowDown", () => {
        if (gameOver) return;
        if (socket.id === player1Id) {
          paddle1Direction = 1;
        } else {
          paddle2Direction = 1;
        }
      });
      socket.on("speed", (speed) => {
        if (gameOver) return;
        if (socket.id === player1Id) {
          paddle1Speed = board.height / speed;
        } else {
          paddle2Speed = board.height / speed;
        }
      });

      socket.on("arrowUpRelease", () => {
        if (gameOver) return;
        if (socket.id === player1Id) {
          paddle1Direction = 0;
        } else {
          paddle2Direction = 0;
        }
      });

      socket.on("arrowDownRelease", () => {
        if (gameOver) return;
        if (socket.id === player1Id) {
          paddle1Direction = 0;
        } else {
          paddle2Direction = 0;
        }
      });
      socket.on("disconnect", () => {
        if (gameOver) return;

        const winner = (socket.id === player1Id) ? "player2" : "player1";
        io.to(roomName).emit("stop", winner);
        gameOver = true;

        stopGameLoop();
      });
    });
  });

  io.to(roomName).emit("start");
  resizeBoard();

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
  function add(board){
    if (ballSpeed < board.width * 0.006)
    {
      ballSpeed += board.width * 0.0005;
    }
  }

  const checkPaddleCollision = (paddle) => {

    const closestX = Math.max(paddle.x, Math.min(ballX, paddle.x + paddle.width));
    const closestY = Math.max(paddle.y, Math.min(ballY, paddle.y + paddle.height));
  
    const distanceX = ballX - closestX;
    const distanceY = ballY - closestY;
    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
  
    if (distanceSquared < (ballRadius * ballRadius)) {
  
      const paddleCenterX = paddle.x + paddle.width / 2;
      const paddleCenterY = paddle.y + paddle.height / 2;
  
      const overlapX = (paddle.width / 2 + ballRadius) - Math.abs(ballX - paddleCenterX);
      const overlapY = (paddle.height / 2 + ballRadius) - Math.abs(ballY - paddleCenterY);
  
      if (overlapY < overlapX) {
        ballYDirection = -ballYDirection;
  
        if (ballY < paddleCenterY) {
          ballY = paddle.y - ballRadius;
        } else {
          ballY = paddle.y + paddle.height + ballRadius;
        }
  
        ballY = Math.max(ballRadius, Math.min(ballY, board.height - ballRadius));
  
      } else {
        ballXDirection = -ballXDirection;
        add(board);
  
        if (ballX < paddleCenterX) {
          ballX = paddle.x - ballRadius;
        } else {
          ballX = paddle.x + paddle.width + ballRadius;
        }
      }
    }
  };

  function moveBall() {
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;

    if (ballSpeed === 0)
    {
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
    checkPaddleCollision(paddle1);
    checkPaddleCollision(paddle2);

    if (ballX + ballRadius < 0) {
      paddle2Score++;
      resetBall();
    } else if (ballX - ballRadius > board.width) {
      paddle1Score++;
      resetBall();
    }
    io.to(roomName).emit("update", {
      ballX, ballY,
      paddle1Y: paddle1.y,
      paddle2Y: paddle2.y
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
}
