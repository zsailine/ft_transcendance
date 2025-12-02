"use strict";

import { Socket } from "socket.io-client";
import type { ThemeColors } from "../Providers/DashboardProvider";
import { drawBall, drawPaddles, clearBoard, drawScore } from "../Pong/draw";


export function startonline(
	role: string,
	theme: ThemeColors,
	socket: Socket,
	onEnd: (winner: string) => void,): () => void {
	const board = document.getElementById("board") as HTMLCanvasElement;
	const ctx = board.getContext("2d") as CanvasRenderingContext2D;
	resizeBoard();
	interface Paddle {
		width: number;
		height: number;
		x: number;
		y: number;
	}
	let interval: number = 0;
	let paddle1 = {
		width: board.width * 0.02,
		height: board.height * 0.15,
		x: 0,
		y: 0,
		Direction: 0,
		Score: 0
	};

	let paddle2 = {
		width: board.width * 0.02,
		height: board.height * 0.15,
		x: board.width * 0.25,
		y: board.height - board.height * 0.15,
		Direction: 0,
		Score: 0
	};
	let paddle3 = {
		width: board.width * 0.02,
		height: board.height * 0.15,
		x: board.width - board.width * 0.02,
		y: 0,
		Direction: 0,
		Score: 0
	};
	let paddle4 = {
		width: board.width * 0.02,
		height: board.height * 0.15,
		x: board.width - board.width * 0.27,
		y: board.height - board.height * 0.15,
		Direction: 0,
		Score: 0
	};

	let paddle1Score = 0;
	let paddle2Score = 0;

	let ballRadius = board.width * 0.0125;
	let ballX: number;
	let ballY: number;
	const paddleSpeed = theme.paddleSpeed ? theme.paddleSpeed : 250;

	function resizeBoard(): void {
		board.width = window.innerWidth * 0.8;
		board.height = window.innerHeight * 0.7;
	}

	function resizePaddle(paddle: Paddle): void {
		paddle.width = board.width * 0.02;
		paddle.height = board.height * 0.15;
	}

	function keyHandler(e: KeyboardEvent): void {
		switch (e.key) {
			case "ArrowUp":
				socket.emit("arrowUp");
				break;
			case "ArrowDown":
				socket.emit("arrowDown");
				break;
		}
	}
	function keyUpHandler(e: KeyboardEvent): void {
		if (theme.slide) return;
		switch (e.key) {
			case "ArrowUp":
				socket.emit("arrowUpRelease");
				break;
			case "ArrowDown":
				socket.emit("arrowUpRelease");
				break;
		}
	}
	const ft_resize = () => {
		const oldWidth = board.width;
		const oldHeight = board.height;
		const oldX = ballX;
		const oldY = ballY;
		const paddle1X = paddle1.x;
		const paddle2X = paddle2.x;
		const paddle1Y = paddle1.y;
		const paddle2Y = paddle2.y;
		const paddle3X = paddle3.x;
		const paddle4X = paddle4.x;
		const paddle3Y = paddle3.y;
		const paddle4Y = paddle4.y;

		resizeBoard();
		ballX = oldX * (board.width / oldWidth);
		ballY = oldY * (board.height / oldHeight);
		ballRadius = board.width * 0.0125;

		paddle1.x = paddle1X * (board.width / oldWidth);
		paddle1.y = paddle1Y * (board.height / oldHeight);
		paddle2.x = paddle2X * (board.width / oldWidth);
		paddle2.y = paddle2Y * (board.height / oldHeight);
		paddle3.x = paddle3X * (board.width / oldWidth);
		paddle3.y = paddle3Y * (board.height / oldHeight);
		paddle4.x = paddle4X * (board.width / oldWidth);
		paddle4.y = paddle4Y * (board.height / oldHeight);

		resizePaddle(paddle1);
		resizePaddle(paddle2);
		resizePaddle(paddle3);
		resizePaddle(paddle4);
	}
	window.addEventListener("resize", ft_resize);

	function convert(type: number, value: number): number {
		const base = type === 1 ? 1600 : 900;
		const current = type === 1 ? ctx.canvas.width : ctx.canvas.height;
		return (value / base) * current;
	}
	socket.on("update", data => {
		clearBoard(ctx, board, theme.boardBackground);
		drawScore(ctx, board, `${paddle1Score}`, `${paddle2Score}`, theme.boardBorder);
		drawBall(ctx, ballRadius, theme.ball, convert(1, data.ballX), convert(0, data.ballY));
		drawPaddles(ctx, theme.paddle1, theme.paddle2, paddle1, paddle4);
		drawPaddles(ctx, theme.paddle1, theme.paddle2, paddle2, paddle3);
	});
	socket.on("paddle1", (data) => {
		paddle1.y = convert(0, data);
	});
	socket.on("paddle2", (data) => {
		paddle2.y = convert(0, data);;
	});
	socket.on("paddle3", (data) => {
		paddle3.y = convert(0, data);
	});
	socket.on("paddle4", (data) => {
		paddle4.y = convert(0, data);;
	});
	socket.on("score", (data) => {
		paddle1Score = data.paddle1Score;
		paddle2Score = data.paddle2Score;
	});
	const finish = (data: string) => {
		clearBoard(ctx, board, theme.boardBackground);
		drawScore(ctx, board, `${paddle1Score}`, `${paddle2Score}`, theme.boardBorder);
		drawPaddles(ctx, theme.paddle1, theme.paddle2, paddle1, paddle2);
		drawBall(ctx, ballRadius, theme.ball, board.width / 2, board.height / 2);
		const result = data.includes(role) ? role : data;
		onEnd(result);
	};
	socket.on("finish", finish);

	socket.on("stop", finish);

	window.addEventListener("keydown", keyHandler);
	window.addEventListener("keyup", keyUpHandler);
	clearInterval(interval);
	socket.emit("speed", paddleSpeed);
	return (() => {
		socket.disconnect();
		window.removeEventListener("keydown", keyHandler);
		window.removeEventListener("keyup", keyUpHandler);
		window.removeEventListener("resize", ft_resize);
	}
	)
}