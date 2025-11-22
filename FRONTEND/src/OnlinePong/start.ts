"use strict";

import { Socket } from "socket.io-client";
import type { ThemeColors } from "../Providers/DashboardProvider";
import { drawBall, drawPaddles, clearBoard, drawScore } from "../Pong/draw";
import api from "../Utils/axios";


const sounds = {
	paddle: new Audio("/sounds/pong.wav"),
};

export function start(
	player: string[],
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

	let paddle1Score = 0;
	let paddle2Score = 0;

	let ballRadius = board.width * 0.0125;
	let ballX: number;
	let ballY: number;
	let paddleSpeed = board.height / 7;


	function resizeBoard(): void {
		board.width = window.innerWidth * 0.8;
		board.height = window.innerHeight * 0.7;
	}

	function resizePaddle(paddle: Paddle): void {
		paddle.width = board.width * 0.02;
		paddle.height = board.height * 0.15;
		paddleSpeed = board.height / 7;
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
	const ft_resize = () => {
		const oldWidth = board.width;
		const oldHeight = board.height;
		const oldX = ballX;
		const oldY = ballY;
		const paddle1X = paddle1.x;
		const paddle2X = paddle2.x;
		const paddle1Y = paddle1.y;
		const paddle2Y = paddle2.y;

		resizeBoard();
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

	function convert(type: number, value: number): number {
		const base = type === 1 ? 1600 : 900;
		const current = type === 1 ? ctx.canvas.width : ctx.canvas.height;
		return (value / base) * current;
	}
	socket.on("update", data => {
		clearBoard(ctx, board, theme.boardBackground);
		drawScore(ctx, board, `${paddle1Score}`, `${paddle2Score}`, theme.boardBorder);
		drawBall(ctx, ballRadius, theme.ball, convert(1, data.ballX), convert(0, data.ballY));
		drawPaddles(ctx, theme.paddle1, theme.paddle2, paddle1, paddle2);
	});
	socket.on("up1", () => {
		paddle1.y = Math.max(paddle1.y - paddleSpeed, 0);
	});
	socket.on("up2", () => {
		paddle2.y = Math.max(paddle2.y - paddleSpeed, 0);
	});
	socket.on("down1", () => {
		paddle1.y = Math.min(paddle1.y + paddleSpeed, board.height - paddle1.height);
	});
	socket.on("down2", () => {
		paddle2.y = Math.min(board.height - paddle2.height, paddle2.y + paddleSpeed);
	});
	socket.on("score", (data) => {
		paddle1Score = data.paddle1Score;
		paddle2Score = data.paddle2Score;
	});

	async function addMatch(winner: string) {
		if (role !== winner)
			return;
		console.log("yo");
		const body = {
			player1: player[0],
			player2: player[1],
			score_p1: paddle1Score,
			score_p2: paddle2Score,
			winner: winner === "player1" ? player[0] : player[1]
		};
		console.log("the winner is " + body.winner + " player1 " + player[0] + " player2 " + player[1]);
		await api.post('/matches/add', body)
			.then(() => {
			})
			.catch((error) => {
				console.error(error);
			});
	}
	const finish = (data: string) => {
		clearBoard(ctx, board, theme.boardBackground);
		drawScore(ctx, board, `${paddle1Score}`, `${paddle2Score}`, theme.boardBorder);
		drawPaddles(ctx, theme.paddle1, theme.paddle2, paddle1, paddle2);
		drawBall(ctx, ballRadius, theme.ball, board.width / 2, board.height / 2);
		onEnd(data);
		addMatch(data);
	};
	socket.on("finish", finish);

	socket.on("stop", finish);

	window.addEventListener("keydown", keyHandler);
	clearInterval(interval);
	socket.on("pong", () => {
		sounds.paddle.currentTime = 0;
		sounds.paddle.play();
	})
	return (() => {
		socket.disconnect();
		window.removeEventListener("resize", ft_resize);
		window.removeEventListener("keydown", keyHandler);
	}
	)
}