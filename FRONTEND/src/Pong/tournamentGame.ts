"use strict";

import type { ThemeColors } from "../Providers/DashboardProvider";
import { drawBall, drawPaddles, clearBoard, drawScore } from "./draw";

const sounds = {
  paddle: new Audio("/sounds/pong.wav"),
};

export function start(
  theme: ThemeColors,
  player: string[],
  setWinner: (winner: string) => void
): () => void {
  const board = document.getElementById("board") as HTMLCanvasElement;
  const ctx = board.getContext("2d") as CanvasRenderingContext2D;
  resizeBoard();

  interface Paddle {
    width: number;
    height: number;
    x: number;
    y: number;
  }

  let paddle1: Paddle = {
    width: board.width * 0.02,
    height: board.height * 0.15,
    x: 0,
    y: board.height / 2 - board.height * 0.075,
  };

  let paddle2: Paddle = {
    width: board.width * 0.02,
    height: board.height * 0.15,
    x: board.width - board.width * 0.02,
    y: board.height / 2 - board.height * 0.075,
  };

  let paddle1Score = 4;
  let paddle2Score = 4;

  let ballRadius = board.width * 0.0125;
  let ballSpeed: number;
  let ballX: number;
  let ballY: number;
  let ballXDirection: number;
  let ballYDirection: number;
  let intervalID: number;
  const speedRatio = theme.paddleSpeed ? theme.paddleSpeed : 250;
  let paddleSpeed = board.height / speedRatio;
  let gameOver = false;

  function resizeBoard(): void {
    board.width = window.innerWidth * 0.8;
    board.height = window.innerHeight * 0.7;
  }

  function checkWinner(): void {
    if (paddle1Score === 5 || paddle2Score === 5) {
      clearBoard(ctx, board, theme.boardBackground);
      gameOver = true;
      clearTimeout(intervalID);
      window.removeEventListener("keydown", keyHandler);
      window.removeEventListener("keyup", keyUpHandler);
      window.removeEventListener("resize", ft_resize);
      const winner =
        paddle1Score === 5
          ? player[0]
          : player[1];
      setWinner(winner);
    }
  }

  function resizePaddle(paddle: Paddle): void {
    paddle.width = board.width * 0.02;
    paddle.height = board.height * 0.15;
    paddleSpeed = board.height / 190;
  }


  function createBall(): void {
    ballSpeed = board.width * 0.001;

    const minY = board.height / 3;
    const maxY = (board.height * 3) / 4;
    ballY = minY + Math.random() * (maxY - minY);
    ballX = board.width / 2;

    const minAngle = 30 * (Math.PI / 180);
    const maxAngle = 70 * (Math.PI / 180);
    const direction = Math.random() > 0.5 ? 1 : -1;

    const angle = minAngle + Math.random() * (maxAngle - minAngle);

    ballXDirection = Math.cos(angle) * direction;
    ballYDirection = Math.sin(angle);
  }

  function moveBall(): void {
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;

    if (ballY - ballRadius < 0 || ballY + ballRadius > board.height)
      ballYDirection = -ballYDirection;

    if (
      ballX - ballRadius <= paddle1.x + paddle1.width &&
      ballY > paddle1.y &&
      ballY < paddle1.y + paddle1.height
    ) {
      ballSpeed += board.width * 0.0005;
      ballX = paddle1.x + paddle1.width + ballRadius;
      ballXDirection = -ballXDirection;
      sounds.paddle.currentTime = 0;
      sounds.paddle.play();
    }

    if (
      ballX + ballRadius >= paddle2.x &&
      ballY > paddle2.y &&
      ballY < paddle2.y + paddle2.height
    ) {
      ballSpeed += board.width * 0.0005;
      ballX = paddle2.x - ballRadius;
      ballXDirection = -ballXDirection;
      sounds.paddle.currentTime = 0;
      sounds.paddle.play();
    }

    if (ballX - ballRadius < 0) {
      paddle2Score++;
      resetBall();
    } else if (ballX + ballRadius > board.width) {
      paddle1Score++;
      resetBall();
    }
  }

  function resetBall(): void {
    if (gameOver) return ;
    createBall();
    checkWinner();
  }

  function movePaddles(): void {
    if (paddle1Direction !== 0) {
      let newY = paddle1.y + paddleSpeed * paddle1Direction;
      paddle1.y = Math.max(0, Math.min(newY, board.height - paddle1.height));
    }
    if (paddle2Direction !== 0) {
      let newY = paddle2.y + paddleSpeed * paddle2Direction;
      paddle2.y = Math.max(0, Math.min(newY, board.height - paddle2.height));
    }
  }
  function nextTick(): void {
    intervalID = window.setTimeout(() => {
      if (gameOver) return ;
      clearBoard(ctx, board, theme.boardBackground);
      movePaddles();
      drawPaddles(ctx, theme.paddle1, theme.paddle2, paddle1, paddle2);
      moveBall();
      drawScore(ctx, board, `${paddle1Score}`, `${paddle2Score}`, theme.boardBorder);
      drawBall(ctx, ballRadius, theme.ball, ballX, ballY);
      nextTick();
    }, 1);
  }
  let paddle1Direction = 0;
  let paddle2Direction = 0;
  function keyHandler(e: KeyboardEvent): void {
    switch (e.key) {
      case "w":
      case "W":
        paddle1Direction = -1;
        break;
      case "s":
      case "S":
        paddle1Direction = 1;
        break;
      case "o":
      case "O":
        paddle2Direction = -1;
        break;
      case "l":
      case "L":
        paddle2Direction = 1;
        break;
    }
  }

  function keyUpHandler(e: KeyboardEvent): void {
    if (theme.slide) return ;
    switch (e.key) {
      case "w":
      case "W":
      case "s":
      case "S":
        paddle1Direction = 0;
        break;
      case "o":
      case "O":
      case "l":
      case "L":
        paddle2Direction = 0;
        break;
    }
  }
  const ft_resize = () => {
    const oldWidth = board.width;
    const oldHeight = board.height;
    const oldSpeed = ballSpeed;
    const oldX = ballX;
    const oldY = ballY;
    const paddle1X = paddle1.x;
    const paddle2X = paddle2.x;
    const paddle1Y = paddle1.y;
    const paddle2Y = paddle2.y;

    resizeBoard();

    ballSpeed = oldSpeed * (board.width / oldWidth);
    ballX = oldX * (board.width / oldWidth);
    ballY = oldY * (board.height / oldHeight);
    ballRadius = board.width * 0.0125;

    paddle1.x = paddle1X * (board.width / oldWidth);
    paddle2.x = paddle2X * (board.width / oldWidth);
    paddle1.y = paddle1Y * (board.height / oldHeight);
    paddle2.y = paddle2Y * (board.height / oldHeight);

    resizePaddle(paddle1);
    resizePaddle(paddle2);
  }
  window.addEventListener("resize", ft_resize);

  createBall();
  drawScore(ctx, board, `${paddle1Score}`, `${paddle2Score}`, theme.boardBorder);
  nextTick();
  window.addEventListener("keydown", keyHandler);
  window.addEventListener("keyup", keyUpHandler);
  return () => {
    gameOver = true;
    clearInterval(intervalID);
    window.removeEventListener("keydown", keyHandler);
    window.removeEventListener("keyup", keyUpHandler);
    window.removeEventListener("resize", ft_resize);
  };
}
