"use strict";
export function menu(goToMainMenu) {
    goToMainMenu();
}
export async function initGame(app, homeHTML, goToMainMenu) {
    const board = document.getElementById("board");
    let ctx = board.getContext("2d");
    if (!ctx)
        throw new Error("Canvas context not found");
    resizeBoard();
    let paddle1 = {
        width: board.width * 0.02,
        height: board.height * 0.15,
        x: 0,
        y: board.height / 2 - board.height * 0.075,
    };
    let paddle2 = {
        width: board.width * 0.02,
        height: board.height * 0.15,
        x: board.width - board.width * 0.02,
        y: board.height / 2 - board.height * 0.075,
    };
    let paddle1Score = 0;
    let paddle2Score = 0;
    let ballRadius = board.width * 0.0125;
    let ballSpeed;
    let ballX;
    let ballY;
    let ballXDirection;
    let ballYDirection;
    let intervalID;
    let paddleSpeed = board.height / 7;
    const paddle1Color = "lightblue";
    const paddle2Color = "red";
    const paddleBorder = "black";
    const ballColor = "yellow";
    const ballBorderColor = "black";
    function resizeBoard() {
        board.width = window.innerWidth * 0.8;
        board.height = window.innerHeight * 0.7;
    }
    function resizePaddle(paddle) {
        paddleSpeed = board.height / 7;
        paddle.width = board.width * 0.02;
        paddle.height = board.height * 0.15;
    }
    function createBall() {
        ballSpeed = board.width * 0.001;
        ballXDirection = Math.random() > 0.5 ? 1 : -1;
        ballYDirection = Math.random() > 0.5 ? 1 : -1;
        ballX = board.width / 2;
        ballY = board.height / 2;
    }
    function drawBall(x, y) {
        ctx.fillStyle = ballColor;
        ctx.strokeStyle = ballBorderColor;
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
    function drawPaddles() {
        ctx.strokeStyle = paddleBorder;
        ctx.fillStyle = paddle1Color;
        ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
        ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
        ctx.fillStyle = paddle2Color;
        ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
        ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    }
    function clearBoard() {
        ctx.fillStyle = "forestgreen";
        ctx.fillRect(0, 0, board.width, board.height);
    }
    function drawScore() {
        const scoreEl = document.getElementById("score");
        if (scoreEl)
            scoreEl.textContent = `${paddle1Score} : ${paddle2Score}`;
    }
    function moveBall() {
        ballX += ballSpeed * ballXDirection;
        ballY += ballSpeed * ballYDirection;
        // Collision avec le haut/bas
        if (ballY - ballRadius < 0 || ballY + ballRadius > board.height)
            ballYDirection = -ballYDirection;
        // Collision avec paddle 1
        if (ballX - ballRadius <= paddle1.x + paddle1.width &&
            ballY > paddle1.y &&
            ballY < paddle1.y + paddle1.height) {
            ballSpeed += board.width * 0.0005;
            ballX = paddle1.x + paddle1.width + ballRadius;
            ballXDirection = -ballXDirection;
        }
        // Collision avec paddle 2
        if (ballX + ballRadius >= paddle2.x &&
            ballY > paddle2.y &&
            ballY < paddle2.y + paddle2.height) {
            ballSpeed += board.width * 0.0005;
            ballX = paddle2.x - ballRadius;
            ballXDirection = -ballXDirection;
        }
        // Score
        if (ballX - ballRadius < 0) {
            paddle2Score++;
            resetBall();
        }
        else if (ballX + ballRadius > board.width) {
            paddle1Score++;
            resetBall();
        }
    }
    function resetBall() {
        createBall();
        drawScore();
    }
    function nextTick() {
        intervalID = window.setTimeout(() => {
            clearBoard();
            drawPaddles();
            moveBall();
            drawBall(ballX, ballY);
            nextTick();
        }, 10);
    }
    function keyHandler(e) {
        switch (e.key) {
            case "w":
            case "W":
                paddle1.y = Math.max(paddle1.y - paddleSpeed, 0);
                break;
            case "s":
            case "S":
                paddle1.y = Math.min(paddle1.y + paddleSpeed, board.height - paddle1.height);
                break;
            case "o":
            case "O":
                paddle2.y = Math.max(paddle2.y - paddleSpeed, 0);
                break;
            case "l":
            case "L":
                paddle2.y = Math.min(paddle2.y + paddleSpeed, board.height - paddle2.height);
                break;
        }
    }
    function resetGame() {
        paddle1Score = 0;
        paddle2Score = 0;
        resetBall();
    }
    // Boutons
    const rstBtn = document.getElementById("rst");
    if (rstBtn)
        rstBtn.addEventListener("click", resetGame);
    const backBtn = document.getElementById("backBtn");
    if (backBtn)
        backBtn.addEventListener("click", () => {
            clearTimeout(intervalID);
            window.removeEventListener("keydown", keyHandler);
            menu(goToMainMenu);
        });
    // Resize
    window.addEventListener("resize", () => {
        const oldWidth = board.width;
        const oldHeight = board.height;
        const oldSpeed = ballSpeed;
        const oldX = ballX;
        const oldY = ballY;
        resizeBoard();
        ballSpeed = oldSpeed * (board.width / oldWidth);
        ballX = oldX * (board.width / oldWidth);
        ballY = oldY * (board.height / oldHeight);
        ballRadius = board.width * 0.0125;
        resizePaddle(paddle1);
        resizePaddle(paddle2);
        paddle2.x = board.width - paddle2.width;
        paddle2.y = board.height - paddle2.height;
    });
    // Initialisation
    createBall();
    drawScore();
    nextTick();
    window.addEventListener("keydown", keyHandler);
}
