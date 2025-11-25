export type Paddle = {
    width: number;
    height: number;
    x: number;
    y: number;
};


export function drawBall(
    ctx: CanvasRenderingContext2D,
    ballRadius: number,
    ballColor: string,
    x: number,
    y: number
): void {
    ctx.fillStyle = ballColor;

    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

export function drawPaddles(
    ctx: CanvasRenderingContext2D,
    paddle1Color: string,
    paddle2Color: string,
    paddle1: Paddle,
    paddle2: Paddle
): void {
    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

export function clearBoard(
    ctx: CanvasRenderingContext2D,
    board: HTMLCanvasElement,
    boardColor: string
): void {
    ctx.fillStyle = boardColor;
    ctx.fillRect(0, 0, board.width, board.height);
}

export function drawScore(
    ctx: CanvasRenderingContext2D,
    board: HTMLCanvasElement,
    score1: string,
    score2: string,
    textColor: string
): void {
    const scale = board.width / 400;
    const fontSize = 16 * scale;

    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textBaseline = "top";

    const textWidth1 = ctx.measureText(score1).width;
    const textWidth2 = ctx.measureText(score2).width;

    const center = board.width / 2;
    const top = board.height * 0.05;
    ctx.fillText(score1, center - board.width / 10 - textWidth2 / 2, top);
    ctx.fillText(score2, center + board.width / 10 - textWidth1 / 2, top);
}