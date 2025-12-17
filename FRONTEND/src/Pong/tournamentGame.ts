"use strict";

import type { ThemeColors } from "../Providers/DashboardProvider";
import { drawBall, drawPaddles, clearBoard, drawScore } from "./draw";
import { moveBall, createBall, movePaddles, type BallInterface, type Paddle } from "./logic";
import { keyHandler, keyUpHandler } from "./event"

export function start(
  theme: ThemeColors,
  player: string[],
  setWinner: (winner: string) => void
): () => void {
  const board = document.getElementById("board") as HTMLCanvasElement;
  let ctx = board.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) throw new Error("Canvas context not found");

  resizeBoard();

  let paddle1: Paddle = {
    width: board.width * 0.02,
    height: board.height * 0.15,
    x: board.width * 0.04,
    y: board.height / 2 - board.height * 0.075,
    Direction: 0,
    Score: 0
  };

  let paddle2: Paddle = {
    width: board.width * 0.02,
    height: board.height * 0.15,
    x: board.width - board.width * 0.06,
    y: board.height / 2 - board.height * 0.075,
    Direction: 0,
    Score: 0
  };
  const ball: BallInterface = {
    Speed: 0,
    Radius: 0,
    X: 0,
    Y: 0,
    XDirection: 0,
    YDirection: 0,
  }

  let finished = 0;
  let intervalID: number;
  ball.Radius = board.width * 0.0125;
  ball.Speed = board.width * 0.002;
  const speedRatio = theme.paddleSpeed ? theme.paddleSpeed : 250;
  let paddleSpeed = board.height / speedRatio;
  let gameOver = false;

  function finish() {
    clearBoard(ctx, board, theme.boardBackground);
    gameOver = true;
    clearTimeout(intervalID);
    window.removeEventListener("resize", () => {
      ft_resize();
    });
    window.removeEventListener("keydown", (e: KeyboardEvent) => {
      keyHandler(e, paddle1, paddle2);
    });
    window.removeEventListener("keyup", (e: KeyboardEvent) => {
      keyUpHandler(e, paddle1, paddle2, theme.slide);
    });
    const winner =
      paddle1.Score === 5
        ? player[0]
        : player[1];
    setWinner(winner);
  }

  function nextTick(): void {
    intervalID = setInterval(() => {
      if (gameOver) return;
      clearBoard(ctx, board, theme.boardBackground);
      movePaddles(board, paddleSpeed, paddle1, paddle2);
      drawPaddles(ctx, theme.paddle1, theme.paddle2, paddle1, paddle2);
      finished = moveBall(1, ball, board, ctx, theme.boardBorder, paddle1, paddle2);
      if (finished)
        finish();
      drawScore(ctx, board, `${paddle1.Score}`, `${paddle2.Score}`, theme.boardBorder);
      drawBall(ctx, ball.Radius, theme.ball, ball.X, ball.Y);
    }, 10);
  }


  createBall(board, ball);
  drawScore(ctx, board, `${paddle1.Score}`, `${paddle2.Score}`, theme.boardBorder);
  nextTick();


  function resizeBoard(): void {
    if (window.innerWidth < 2 || window.innerHeight < 2) {
      board.width = 1;
      board.height = 1;
      return;
    }
    board.width = window.innerWidth * 0.8;
    board.height = window.innerHeight * 0.7;
  }

  function resizePaddle(paddle: Paddle): void {
    paddleSpeed = board.height / 200;
    paddle.width = board.width * 0.02
    paddle.height = board.height * 0.15;
  }

  const ft_resize = () => {
    const oldWidth = board.width;
    const oldHeight = board.height;
    const oldSpeed = ball.Speed;
    const oldX = ball.X;
    const oldY = ball.Y;
    const paddle1X = paddle1.x;
    const paddle2X = paddle2.x;
    const paddle1Y = paddle1.y;
    const paddle2Y = paddle2.y;

    resizeBoard();

    ball.Speed = oldSpeed * (board.width / oldWidth);
    ball.X = oldX * (board.width / oldWidth);
    ball.Y = oldY * (board.height / oldHeight);
    ball.Radius = board.width * 0.0125;

    paddle1.x = paddle1X * (board.width / oldWidth);
    paddle2.x = paddle2X * (board.width / oldWidth);
    paddle1.y = paddle1Y * (board.height / oldHeight);
    paddle2.y = paddle2Y * (board.height / oldHeight);

    resizePaddle(paddle1);
    resizePaddle(paddle2);
  }

  window.addEventListener("resize", ft_resize);
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    keyHandler(e, paddle1, paddle2);
  });
  window.addEventListener("keyup", (e: KeyboardEvent) => {
    keyUpHandler(e, paddle1, paddle2, theme.slide);
  });
  return () => {
    clearInterval(intervalID);
    window.removeEventListener("resize", ft_resize);
    window.removeEventListener("keydown", (e: KeyboardEvent) => {
      keyHandler(e, paddle1, paddle2);
    });
    window.removeEventListener("keyup", (e: KeyboardEvent) => {
      keyUpHandler(e, paddle1, paddle2, theme.slide);
    });
  };
}
