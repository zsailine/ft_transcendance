"use strict";

import type { ThemeColors } from "../Providers/DashboardProvider";
import { drawBall, drawPaddles, clearBoard, drawScore } from "./draw";
import { moveBall, createBall, resetBall, movePaddles, type BallInterface, type Paddle } from "./logic";
import {  keyHandler, keyUpHandler } from "./event"


export function initGame(theme: ThemeColors): () => void {
  const board = document.getElementById("board") as HTMLCanvasElement;
  let ctx = board.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) throw new Error("Canvas context not found");

  resizeBoard();

  let paddle1: Paddle = {
    width: board.width * 0.02,
    height: board.height * 0.15,
    x: 75,
    y: board.height / 2 - board.height * 0.075,
    Direction: 0,
    Score: 0
  };

  let paddle2: Paddle = {
    width: board.width * 0.02,
    height: board.height * 0.15,
    x: board.width - board.width * 0.02 - 50,
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

  let intervalID: number;
  ball.Radius = board.width * 0.0125;
  ball.Speed = board.width * 0.001;
  const speedRatio = theme.paddleSpeed ? theme.paddleSpeed : 250;
  let paddleSpeed = board.height / speedRatio;

  function nextTick(): void {
    intervalID = window.setTimeout(() => {
      clearBoard(ctx, board, theme.boardBackground);
      movePaddles(board, paddleSpeed, paddle1, paddle2);
      drawPaddles(ctx, theme.paddle1, theme.paddle2, paddle1, paddle2);
      moveBall(0, ball, board, ctx, theme.boardBorder, paddle1, paddle2);
      drawScore(ctx, board, `${paddle1.Score}`, `${paddle2.Score}`, theme.boardBorder);
      drawBall(ctx, ball.Radius, theme.ball, ball.X, ball.Y);
      nextTick();
    }, 1);
  }

  function resetGame(): void {
    paddle1.Score = 0;
    paddle2.Score = 0;
    resetBall(0, ball, board, ctx, paddle1.Score, paddle2.Score, theme.boardBorder);
  }

  const rstBtn = document.getElementById("rst");
  if (rstBtn) rstBtn.addEventListener("click", resetGame);

  createBall(board, ball);
  drawScore(ctx, board, `${paddle1.Score}`, `${paddle2.Score}`, theme.boardBorder);
  nextTick();
  

  function resizeBoard(): void {
    if (window.innerWidth < 2 || window.innerHeight < 2)
    {
      board.width = 1;
      board.height = 1;
      return ;
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
    // const paddle2X = paddle2.x;
    const paddle1Y = paddle1.y;
    const paddle2Y = paddle2.y;

    resizeBoard();

    ball.Speed = oldSpeed * (board.width / oldWidth);
    ball.X = oldX * (board.width / oldWidth);
    ball.Y = oldY * (board.height / oldHeight);
    ball.Radius = board.width * 0.0125;

    paddle1.x = paddle1X * (board.width / oldWidth);
    paddle2.x = board.width - board.width * 0.02
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
    if (rstBtn)
      rstBtn.removeEventListener("click", resetGame);
  };
}
