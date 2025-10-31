"use strict";
import fastifySocketIO from 'fastify-socket.io';

const board = {
  width: 0,
  height: 0
}

export async function initGame(io, roomName, player1Id, player2Id)
{
  io.in(roomName).fetchSockets().then((sockets) => {
    sockets.forEach((socket) => {
      socket.on("arrowUp", () => {
        if (socket.id === player1Id)
        {
          paddle1.y = Math.max(0, paddle1.y - paddleSpeed);
          io.to(roomName).emit("up1");
        }
        else
        {
          paddle2.y = Math.max(0, paddle2.y - paddleSpeed);
          io.to(roomName).emit("up2")
        }
      });

      socket.on("arrowDown", () => {
        if (socket.id === player1Id)
        {
          paddle1.y = Math.min(board.height - paddle1.height, paddle1.y + paddleSpeed);
          io.to(roomName).emit("down1");
        }
        else
        {
          paddle2.y = Math.min(board.height - paddle2.height, paddle2.y + paddleSpeed);
          io.to(roomName).emit("down2");
        }
      });

      socket.on("disconnect", () => {
        const winner = player1Id === socket ? "player2" : "player1";
        io.to(roomName).emit("stop", winner);
        stopGameLoop();
      });
    });
  });
  io.to(roomName).emit("start");
  resizeBoard();
  
  let paddle1 = {
    width: board.width * 0.02,
    height: board.height * 0.15,
    x: 0,
    y: board.height / 2 - board.height * 0.075,
  };
  
  let paddle2 = {
    width: board.width * 0.02,
    height: board.height * 0.15,
    x: board.width - board.width * 0.02,
    y: board.height / 2 - board.height * 0.075,
  };

  let paddle1Score = 0;
  let paddle2Score = 0;
  let ballSpeed;
  let ballX;
  let ballY;
  let ballXDirection;
  let ballYDirection;
  let intervalID;
  let ballRadius = board.width * 0.0125;
  let paddleSpeed = board.height / 7;
  
  function resizeBoard(){
    board.width = 1600;
    board.height = 900;
  }

  function createBall(){
    ballSpeed = board.width * 0.001;
    ballXDirection = Math.random() > 0.5 ? 1 : -1;
    ballYDirection = Math.random() > 0.5 ? 1 : -1;
    ballX = board.width / 2;
    ballY = board.height / 2;
  }

  function moveBall(){
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;

    if (ballY - ballRadius < 0)
    {
      ballYDirection = -ballYDirection;
      ballY = 0 + ballRadius;
    }
    if (ballY + ballRadius > board.height)
    {
      ballYDirection = -ballYDirection;
      ballY = board.height - ballRadius;
    }
    if (
      ballX - ballRadius <= paddle1.x + paddle1.width &&
      ballY > paddle1.y &&
      ballY < paddle1.y + paddle1.height
    ) {
      ballSpeed += board.width * 0.0005;
      ballX = paddle1.x + paddle1.width + ballRadius;
      ballXDirection = -ballXDirection;
    }

    if (
      ballX + ballRadius >= paddle2.x &&
      ballY > paddle2.y &&
      ballY < paddle2.y + paddle2.height
    ) {
      ballSpeed += board.width * 0.0005;
      ballX = paddle2.x - ballRadius;
      ballXDirection = -ballXDirection;
    }

    if (ballX - ballRadius < 0) {
      paddle2Score++;
      resetBall();
    } else if (ballX + ballRadius > board.width) {
      paddle1Score++;
      resetBall();
    }
    io.to(roomName).emit("update", {
      ballX, ballY,
      paddle1Y: paddle1.y,
      paddle2Y: paddle2.y
    });
  }

  function checkWinner()
  {
	  if (paddle1Score === 5 || paddle2Score === 5) {
		stopGameLoop();
		const winner =
		  paddle1Score === 5
			? "player1"
			: "player2";
		io.to(roomName).emit("finish", winner) }
	}

  function resetBall(){
    createBall();
    io.to(roomName).emit("score", {paddle1Score, paddle2Score});
    checkWinner();
  }

  function startGameLoop() {
    intervalID = setInterval(() => {
      moveBall();
    }, 10);
  }
  
  function stopGameLoop() {
    clearInterval(intervalID);
  }
  createBall();
  startGameLoop();
}
