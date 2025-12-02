

import { drawScore } from "./draw";


export type Paddle = {
	width: number;
	height: number;
	x: number;
	y: number;
	Direction: number;
	Score: number
};

export interface BallInterface {
	Speed: number,
	Radius: number,
	X: number,
	Y: number,
	XDirection: number,
	YDirection: number
}

function checkWinner(paddle1Score: number, paddle2Score: number): number {
	if (paddle1Score === 5 || paddle2Score === 5) {
		return (1);
	}
	return 0;
}

function createBall(board: HTMLCanvasElement, ball: BallInterface): void {
	ball.Speed = board.width * 0.002;

	const minY = board.height / 3;
	const maxY = (board.height * 3) / 4;
	ball.Y = minY + Math.random() * (maxY - minY);
	ball.X = board.width / 2;

	const minAngle = 30 * (Math.PI / 180);
	const maxAngle = 50 * (Math.PI / 180);
	const direction = Math.random() > 0.5 ? 1 : -1;

	const angle = minAngle + Math.random() * (maxAngle - minAngle);

	ball.XDirection = Math.cos(angle) * direction;
	ball.YDirection = Math.sin(angle);
}

const checkPaddleCollision = (board:HTMLCanvasElement, paddle: Paddle, ball: BallInterface) => {

	const closestX = Math.max(paddle.x, Math.min(ball.X, paddle.x + paddle.width));
	const closestY = Math.max(paddle.y, Math.min(ball.Y, paddle.y + paddle.height));

	const distanceX = ball.X - closestX;
	const distanceY = ball.Y - closestY;
	const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

	if (distanceSquared < (ball.Radius * ball.Radius)) {

		const paddleCenterX = paddle.x + paddle.width / 2;
		const paddleCenterY = paddle.y + paddle.height / 2;

		const overlapX = (paddle.width / 2 + ball.Radius) - Math.abs(ball.X - paddleCenterX);
		const overlapY = (paddle.height / 2 + ball.Radius) - Math.abs(ball.Y - paddleCenterY);

		if (overlapY < overlapX) {
			ball.YDirection = -ball.YDirection;

			if (ball.Y < paddleCenterY) {
				ball.Y = paddle.y - ball.Radius;
			} else {
				ball.Y = paddle.y + paddle.height + ball.Radius;
			}

			ball.Y = Math.max(ball.Radius, Math.min(ball.Y, board.height - ball.Radius));

		} else {
			ball.XDirection = -ball.XDirection;
			add(board, ball);

			if (ball.X < paddleCenterX) {
				ball.X = paddle.x - ball.Radius;
			} else {
				ball.X = paddle.x + paddle.width + ball.Radius;
			}
		}
	}
};


function add(board: HTMLCanvasElement, ball: BallInterface){
	if (ball.Speed < board.width * 0.006)
	{
		ball.Speed += board.width * 0.0005;
	}
}

function moveBall(mode: number, ball:BallInterface, board: HTMLCanvasElement, ctx: CanvasRenderingContext2D, boardBoarder: string,
	paddle1: Paddle, paddle2: Paddle): number {
	ball.X += ball.Speed * ball.XDirection;
	ball.Y += ball.Speed * ball.YDirection;
	let finished = 0;
	if (ball.Speed === 0)
		return (0);
	if (ball.Y - ball.Radius < 0 || ball.Y + ball.Radius > board.height)
		ball.YDirection = -ball.YDirection;

	checkPaddleCollision(board, paddle1, ball);
	checkPaddleCollision(board, paddle2, ball);
	if (ball.X + ball.Radius < 0) {
		paddle2.Score++;
		finished = resetBall(mode, ball, board, ctx, paddle1.Score, paddle2.Score, boardBoarder);
		ball.XDirection = -ball.XDirection;
	} else if (ball.X - ball.Radius > board.width) {
		paddle1.Score++;
		finished = resetBall(mode, ball, board, ctx, paddle1.Score, paddle2.Score, boardBoarder);
		ball.XDirection = -ball.XDirection;
	}
	return (finished);
}

function resetBall(mode: number, ball: BallInterface, board: HTMLCanvasElement, ctx: CanvasRenderingContext2D, paddle1Score: number, paddle2Score: number,
	boardBorder: string
): number {
	drawScore(ctx, board, `${paddle1Score}`, `${paddle2Score}`, boardBorder);
    ball.Speed = 0;
    setTimeout(() => {
        createBall(board, ball);
    }, 500);

	if (mode && checkWinner(paddle1Score, paddle2Score))
		return (1);
	return 0;
}

function movePaddles(board: HTMLCanvasElement, paddleSpeed: number, paddle1: Paddle, paddle2: Paddle): void {
	if (paddle1.Direction !== 0) {
		let newY = paddle1.y + paddleSpeed * paddle1.Direction;
		paddle1.y = Math.max(0, Math.min(newY, board.height - paddle1.height));
	}
	if (paddle2.Direction !== 0) {
		let newY = paddle2.y + paddleSpeed * paddle2.Direction;
		paddle2.y = Math.max(0, Math.min(newY, board.height - paddle2.height));
	}
}

export { moveBall, movePaddles, resetBall, createBall };

