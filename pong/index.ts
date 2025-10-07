const score = document.querySelector("#score") as HTMLHeadingElement;
const rst   = document.querySelector("#rst") as HTMLParagraphElement;
const board = document.getElementById("board") as HTMLCanvasElement;
const ctx   = board.getContext("2d") as CanvasRenderingContext2D;

board.width  = window.innerWidth * 0.8;  // 80% de l’écran
board.height = window.innerHeight * 0.7; // 70% de l’écran

window.innerWidth * 0.8;
window.innerHeight * 0.7;
let boardWidth = board.width;
let boardHeight = board.height;
const boardBackground = "forestgreen";
const paddle1Color = "lightblue";
const paddle2Color = "red";
const paddleBorder = "black";
const ballColor = "yellow";
const ballBorsderColor = "black";
const paddleSpeed = 50;

let IntervallID;
let ballSpeed = 1;
let ballX = boardWidth / 2;
let ballY =  boardHeight / 2;
let ballXDirection = 0;
let BallYDirection = 0;
let paddle1Score = 0;
let paddle2Score = 0;
let ballRadius = board.width * 0.0125;
let paddle1 = {
    width: board.width * 0.02,   
    height: board.height * 0.15,
    x: 0,
    y: 0
};

let paddle2 = {
    width: board.width * 0.02,
    height: board.height * 0.15,
    x: 0,
    y: 0 
};

paddle2.x = board.width - paddle2.width;   
paddle2.y = board.height - paddle2.height;


function resizeBoard() {
    board.width  = window.innerWidth * 0.8;
    board.height = window.innerHeight * 0.7;
    boardWidth = board.width;
    boardHeight = board.height;
}


function resizepaddle(paddle: any) {
    paddle.width  = board.width * 0.02;   
    paddle.height = board.height * 0.15;  
}



window.addEventListener("resize", () => {
    resizeBoard(); // initial
    ballRadius = board.width * 0.0125;
    resizepaddle(paddle1);
    resizepaddle(paddle2);
    paddle2.x = board.width - paddle2.width;   
    paddle2.y = board.height - paddle2.height;
});

window.addEventListener("keydown", changeDirection);
rst.addEventListener("click", resetGame);

gameStart();

function changeDirection()
{
    
}
function gameStart()
{
    createBall();
    nextTick();
}
function nextTick()
{
    IntervallID = setTimeout(() => {
        clear();
        drawPaddles();
        moveBall();
        drawBall(ballX, ballY);
        nextTick();
    }, 10);
}


function drawPaddles()
{
    ctx.strokeStyle = paddleBorder;
    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y ,paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y ,paddle1.width, paddle1.height);

    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y ,paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y ,paddle2.width, paddle2.height);
}

function createBall()
{
    ballSpeed = 1;
    ballXDirection = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    BallYDirection = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ballX = boardWidth / 2;
    ballY = boardHeight / 2;
    drawBall(ballX, ballY);    
}

function resetBall() {
    createBall();
    drawScore();
}

function moveBall()
{
    ballX += (ballSpeed * ballXDirection);
    ballY += (ballSpeed * BallYDirection);
    if(ballY - ballRadius < 0 || ballY + ballRadius > board.height){
        BallYDirection = -BallYDirection;
    }

    // Collision with paddles
    if(ballX - ballRadius <= paddle1.x + paddle1.width &&
       ballY > paddle1.y &&
       ballY < paddle1.y + paddle1.height) {
        ballSpeed += 1;
        ballX = (paddle1.x + paddle1.width) + ballRadius;
        ballXDirection = -ballXDirection;
    }

    if(ballX + ballRadius >= paddle2.x &&
       ballY > paddle2.y &&
       ballY < paddle2.y + paddle2.height) {
        ballX = paddle2.x - ballRadius;
        ballSpeed += 1;
        ballXDirection = -ballXDirection;
    }

    // Score
    if(ballX - ballRadius < 0){
        paddle2Score++;
        resetBall();
    }
    if(ballX + ballRadius > board.width){
        paddle1Score++;
        resetBall();
    }
}

function drawBall(x: number, y: number) {
    ctx.fillStyle = ballColor;         
    ctx.strokeStyle = ballBorsderColor;
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}


function clear()
{
    ctx.fillStyle = "forestgreen";
    ctx.fillRect(0, 0 ,board.width, board.height);
}
window.addEventListener("keydown", (e) => {
    switch(e.key){
        case "O":
        case "o":
            paddle2.y = Math.max(paddle2.y - paddleSpeed, 0);
            break;
        case "l":
            case "L":
            paddle2.y = Math.min(paddle2.y + paddleSpeed, board.height - paddle2.height);
            break;
        case "z":
        case "Z":
            paddle1.y = Math.max(paddle1.y - paddleSpeed, 0);
            break;
        case "s":
        case "S":
            paddle1.y = Math.min(paddle1.y + paddleSpeed, board.height - paddle1.height);
            break;
    }
});

function drawScore() {
    score.textContent = `${paddle1Score} : ${paddle2Score}`;
}

function resetGame()
{
    paddle1Score = 0;
    paddle2Score = 0;
    resetBall();
}
