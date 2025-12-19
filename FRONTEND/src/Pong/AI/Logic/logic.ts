import type { BallInterface, Paddle } from "../../logic";

let lastDecisionTime = 0;
let aiTargetY = 0;

export const moveAIPaddle = (
	ball: BallInterface,
	paddle2: Paddle,
	boardWidth: number,
	slide: boolean | undefined ) => {
	const now = Date.now();
	const ballGoingToAI = ball.XDirection > 0;
	const ballInZone = ball.X > boardWidth * 0.75;
	if (ballGoingToAI && ballInZone && now - lastDecisionTime > 120) {
		aiTargetY = ball.Y - paddle2.height / 2 + (Math.random() - 0.5) * paddle2.height * 0.2;
		lastDecisionTime = now;
	}
	if (!ballGoingToAI) {
		return;
	}
	const diff = aiTargetY - paddle2.y;
	const deadzone = (slide) ? 50 : 10;
	if (Math.abs(diff) < deadzone) {
		if (!slide) {
			paddle2.Direction = 0;
		}
		return;
	}
	paddle2.Direction = diff > 0 ? 1 : -1;
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
		let newY = paddle2.y + paddleSpeed * paddle2.Direction;
		paddle2.y = Math.max(0, Math.min(newY, board.height - paddle2.height));
	}
}
