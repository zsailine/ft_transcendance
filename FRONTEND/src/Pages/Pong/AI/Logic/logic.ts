import type { BallInterface, Paddle } from "../../../../Pong/logic";

let lastDecisionTime: number = 0;
let aiTargetY: number = 0;

export const moveAIPaddle = (ball: BallInterface, paddle2: Paddle) => {
	const date = Date.now();
	if (date - lastDecisionTime > 1000) {
		// const errorMargin = (Math.random() - 0.5) * 50;
		aiTargetY = ball.Y - paddle2.height / 2;
		lastDecisionTime = date;
	}
	if (paddle2.y < aiTargetY) {
		paddle2.Direction = 1;
	} else if (paddle2.y > aiTargetY) {
		paddle2.Direction = -1;
	} else {
		paddle2.Direction = 0;
	}
}

export const movePlayerPaddle = (
	board: HTMLCanvasElement,
	paddleSpeed: number,
	paddle1: Paddle,
	paddle2: Paddle) => {
	if (paddle1.Direction !== 0) {
		console.log()
		let newY = paddle1.y + paddleSpeed * paddle1.Direction;
		paddle1.y = Math.max(0, Math.min(newY, board.height - paddle1.height));
	}
	if (paddle2.Direction !== 0) {
		let newY = paddle2.y + paddleSpeed * paddle2.Direction;
		paddle2.y = Math.max(0, Math.min(newY, board.height - paddle2.height));
	}
}
