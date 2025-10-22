"use strict";
export async function initTournament() {
    return new Promise((resolve) => {
        const board = document.getElementById("board");
        const ctx = board.getContext("2d");
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
        let paddle1Score = 4;
        let paddle2Score = 4;
        let ballRadius = board.width * 0.0125;
        let ballSpeed;
        let ballX;
        let ballY;
        let ballXDirection;
        let ballYDirection;
        let intervalID;
        let paddleSpeed = board.height / 7;
        let gameOver = false;
        const paddle1Color = "lightblue";
        const paddle2Color = "red";
        const paddleBorder = "black";
        const ballColor = "yellow";
        const ballBorderColor = "black";
        function resizeBoard() {
            board.width = window.innerWidth * 0.8;
            board.height = window.innerHeight * 0.7;
        }
        function showWinnerOverlay(winner) {
            if (document.getElementById("winnerOverlay"))
                return;
            const overlay = document.createElement("div");
            overlay.id = "winnerOverlay";
            overlay.className = `
        fixed inset-0 flex flex-col items-center justify-center 
        bg-black/50 text-white z-50`;
            const title = document.createElement("h1");
            title.textContent = `${winner} won ! 🏆`;
            title.className = "text-4xl font-bold mb-6";
            const quitBtn = document.createElement("button");
            quitBtn.textContent = "Next";
            quitBtn.className =
                "px-6 py-3 bg-yellow-400 text-gray-900 text-xl font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition-all";
            quitBtn.addEventListener("click", () => {
                overlay.remove();
                window.removeEventListener("keydown", keyHandler);
                resolve(winner);
            });
            overlay.append(title, quitBtn);
            document.body.appendChild(overlay);
        }
        function checkWinner() {
            if (paddle1Score === 5 || paddle2Score === 5) {
                gameOver = true;
                clearTimeout(intervalID);
                window.removeEventListener("keydown", keyHandler);
                const winner = paddle1Score === 5
                    ? (document.getElementById("player1")?.innerHTML ?? "Player 1")
                    : (document.getElementById("player2")?.innerHTML ?? "Player 2");
                showWinnerOverlay(winner);
            }
        }
        function resizePaddle(paddle) {
            paddle.width = board.width * 0.02;
            paddle.height = board.height * 0.15;
            paddleSpeed = board.height / 7;
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
            const score = document.getElementById("score");
            if (score)
                score.textContent = `${paddle1Score} : ${paddle2Score}`;
            checkWinner();
        }
        function moveBall() {
            ballX += ballSpeed * ballXDirection;
            ballY += ballSpeed * ballYDirection;
            if (ballY - ballRadius < 0 || ballY + ballRadius > board.height)
                ballYDirection = -ballYDirection;
            if (ballX - ballRadius <= paddle1.x + paddle1.width &&
                ballY > paddle1.y &&
                ballY < paddle1.y + paddle1.height) {
                ballSpeed += board.width * 0.0005;
                ballX = paddle1.x + paddle1.width + ballRadius;
                ballXDirection = -ballXDirection;
            }
            if (ballX + ballRadius >= paddle2.x &&
                ballY > paddle2.y &&
                ballY < paddle2.y + paddle2.height) {
                ballSpeed += board.width * 0.0005;
                ballX = paddle2.x - ballRadius;
                ballXDirection = -ballXDirection;
            }
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
            if (gameOver)
                return;
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
        document.getElementById("rst")?.addEventListener("click", resetGame);
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
        createBall();
        drawScore();
        nextTick();
        window.addEventListener("keydown", keyHandler);
    });
}
