import type { BallInterface, Paddle } from "../../logic";

let lastDecisionTime = 0;
let aiTargetY = 0;

export const moveAIPaddle = (ball: BallInterface, paddle2: Paddle, boardHeight: number) => {
	const date = Date.now();
	const ballGoingToAI = ball.XDirection > 0;
	const ballInZone = ball.X > boardHeight * 0.75;

	if (ballGoingToAI && ballInZone && date - lastDecisionTime > 100) {
		aiTargetY = ball.Y - paddle2.height / 2 + (Math.random() - 0.5) * 10;
		lastDecisionTime = date;
	}
	const diff = aiTargetY - paddle2.y;
	if (Math.abs(diff) < 10) {
		paddle2.Direction = 0;
	} else if (diff > 0) {
		paddle2.Direction = 1;
	} else {
		paddle2.Direction = -1;
	}
};


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
		let newY = paddle2.y + (paddleSpeed + 0.75) * paddle2.Direction;
		paddle2.y = Math.max(0, Math.min(newY, board.height - paddle2.height));
	}
}
