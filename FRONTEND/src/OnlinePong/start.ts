"use strict";

import { Socket } from "socket.io-client";

const sounds = {
	paddle: new Audio("/sounds/pong.wav"),
};

export function start(
	socket: Socket,
	onGameStart: () => void,
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

	const paddle1Color = "lightblue";
	const paddle2Color = "red";
	const paddleBorder = "black";
	const ballColor = "yellow";
	const ballBorderColor = "black";

	function resizeBoard(): void {
		board.width = window.innerWidth * 0.8;
		board.height = window.innerHeight * 0.7;
	}

	function resizePaddle(paddle: Paddle): void {
		paddle.width = board.width * 0.02;
		paddle.height = board.height * 0.15;
		paddleSpeed = board.height / 7;
	}

	function drawBall(x: number, y: number): void {
		ctx.fillStyle = ballColor;
		ctx.strokeStyle = ballBorderColor;
		ctx.beginPath();
		ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}

	function drawPaddles(): void {
		ctx.strokeStyle = paddleBorder;

		ctx.fillStyle = paddle1Color;
		ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
		ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

		ctx.fillStyle = paddle2Color;
		ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
		ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
	}

	function clearBoard(): void {
		ctx.fillStyle = "forestgreen";
		ctx.fillRect(0, 0, board.width, board.height);
	}

	function drawScore(): void {
		const scale = board.width / 400;
		const fontSize = 16 * scale;

		ctx.fillStyle = "black";
		ctx.font = `bold ${fontSize}px Arial`;
		ctx.textBaseline = "top";

		const score1 = `${paddle2Score}`;
		const score2 = `${paddle1Score}`;

		const textWidth1 = ctx.measureText(score1).width;
		const textWidth2 = ctx.measureText(score2).width;

		const center = board.width / 2;
		const top = board.height * 0.05;
		ctx.fillText(score1, center + board.width / 10 - textWidth1 / 2, top);
		ctx.fillText(score2, center - board.width / 10 - textWidth2 / 2, top);
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
		clearBoard();
		drawScore();
		drawBall(convert(1, data.ballX), convert(0, data.ballY));
		drawPaddles();
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
	socket.on("score", data => {
		paddle1Score = data.paddle1Score;
		paddle2Score = data.paddle2Score;
	});
	socket.on("finish", data => {
		socket.disconnect();
		clearBoard();
		drawScore();
		drawPaddles();
		drawBall(board.width / 2, board.height / 2);
		onEnd(data);
	});
	socket.on("stop", data => {
		socket.disconnect();
		clearBoard();
		drawScore();
		drawPaddles();
		drawBall(board.width / 2, board.height / 2);
		onEnd(data);
	});
	window.addEventListener("keydown", keyHandler);
	clearInterval(interval);
	onGameStart();
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