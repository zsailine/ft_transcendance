"use strict";

function menu(goToMainMenu)
{
  goToMainMenu();
}
export async function initGame(app, homeHTML, goToMainMenu) {
  let board = document.getElementById("board");
  let ctx = board.getContext("2d");
  resizeBoard();

  let paddle1 = { width: board.width * 0.02, height: board.height * 0.15, x: 0, y: board.height / 2 - board.height * 0.075 };
  let paddle2 = { width: board.width * 0.02, height: board.height * 0.15, x: board.width - board.width * 0.02, y: board.height / 2 - board.height * 0.075 };
  let paddle1Score = 0, paddle2Score = 0;
  let ballRadius = board.width * 0.0125;
  let ballSpeed, ballX, ballY, ballXDirection, ballYDirection;
  let IntervallID;
  let paddleSpeed = board.height / 7;

  const paddle1Color = "lightblue";
  const paddle2Color = "red";
  const paddleBorder = "black";
  const ballColor = "yellow";
  const ballBorsderColor = "black";

  function resizeBoard() {
    board.width  = window.innerWidth * 0.8;
    board.height = window.innerHeight * 0.7;
}


function resizepaddle(paddle) {
    paddleSpeed = board.height / 7;
    paddle.width  = board.width * 0.02;   
    paddle.height = board.height * 0.15;  
}

  function createBall() {
    ballSpeed = board.width * 0.001;
    ballXDirection = Math.random() > 0.5 ? 1 : -1;
    ballYDirection = Math.random() > 0.5 ? 1 : -1;
    ballX = board.width / 2;
    ballY = board.height / 2;
  }

  function drawBall(x, y) {
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorsderColor;
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  function drawPaddles() {
    ctx.strokeStyle = paddleBorder;
    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  }

  function clearBoard() {
    ctx.fillStyle = "forestgreen";
    ctx.fillRect(0, 0, board.width, board.height);
  }

  function drawScore() {
    document.getElementById("score").textContent = `${paddle1Score} : ${paddle2Score}`;
  }

  function moveBall() {
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;

    if (ballY - ballRadius < 0 || ballY + ballRadius > board.height)
      ballYDirection = -ballYDirection;

    if (ballX - ballRadius <= paddle1.x + paddle1.width &&
        ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
      ballSpeed += board.width * 0.0005;
      ballX = (paddle1.x + paddle1.width) + ballRadius;
      ballXDirection = -ballXDirection;
    }

    if (ballX + ballRadius >= paddle2.x &&
        ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
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
  }

  function resetBall() {
    createBall();
    drawScore();
  }

  function nextTick() {
    IntervallID = setTimeout(() => {
      clearBoard();
      drawPaddles();
      moveBall();
      drawBall(ballX, ballY);
      nextTick();
    }, 10);
  }

  function keyHandler(e) {
    switch (e.key) {
      case "w": case "W":
        paddle1.y = Math.max(paddle1.y - paddleSpeed, 0);
        break;
      case "s": case "S":
        paddle1.y = Math.min(paddle1.y + paddleSpeed, board.height - paddle1.height);
        break;
      case "o": case "O":
        paddle2.y = Math.max(paddle2.y - paddleSpeed, 0);
        break;
      case "l": case "L":
        paddle2.y = Math.min(paddle2.y + paddleSpeed, board.height - paddle2.height);
        break;
    }
  }

  function resetGame() {
    paddle1Score = 0;
    paddle2Score = 0;
    resetBall();
  }
  document.getElementById("rst").addEventListener("click", resetGame);
  document.getElementById("backBtn").addEventListener("click", () => {
      clearTimeout(IntervallID);
      window.removeEventListener("keydown", keyHandler);
      menu(goToMainMenu);
  });
  window.addEventListener("resize", () => {
    const ancient = board.width;
    const ancientHeight = board.height;
    const oldSpeed = ballSpeed;
    const oldX = ballX;
    const oldY = ballY;
    resizeBoard();
    ballSpeed = oldSpeed * (board.width / ancient);
    ballX = oldX * (board.width / ancient);
    ballY = oldY * (board.height / ancientHeight);
    ballRadius = board.width * 0.0125;
    resizepaddle(paddle1);
    resizepaddle(paddle2);
    paddle2.x = board.width - paddle2.width;   
    paddle2.y = board.height - paddle2.height;
  });
  createBall();
  drawScore();
  nextTick();
  window.addEventListener("keydown", keyHandler);
}
