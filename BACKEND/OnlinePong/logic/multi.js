"use strict";


export async function startMulti(io, roomName, user1Id, user2Id, user3Id, user4Id, onEnd
) {
	const board = {
		width: 0,
		height: 0
	}
	let gameOver = false;
	let paddle1Speed = board.height / 250;
	let paddle2Speed = board.height / 250;
	let paddle3Speed = board.height / 250;
	let paddle4Speed = board.height / 250;
	let paddle1Direction = 0;
	let paddle2Direction = 0;
	let paddle3Direction = 0;
	let paddle4Direction = 0;
	let players = {
		player1: { userId: user1Id, socketId: null, socket: null },
		player2: { userId: user2Id, socketId: null, socket: null },
		player3: { userId: user3Id, socketId: null, socket: null },
		player4: { userId: user4Id, socketId: null, socket: null },
	};

	const removeListeners = (socket) => {
		socket.removeAllListeners("arrowUp");
		socket.removeAllListeners("arrowDown");
		socket.removeAllListeners("arrowUpRelease");
		socket.removeAllListeners("arrowDownRelease");
		socket.removeAllListeners("disconnect");
	}
	const attachListeners = (socket, role) => {
		removeListeners(socket);
		socket.data.gameRole = role;

		socket.on("arrowUp", () => {
			if (gameOver) return;
			if (role === "player1") paddle1Direction = -1;
			else if (role === "player2") paddle2Direction = -1;
			else if (role === "player3") paddle3Direction = -1;
			else if (role === "player4") paddle4Direction = -1;
		});

		socket.on("arrowDown", () => {
			if (gameOver) return;
			if (role === "player1") paddle1Direction = 1;
			else if (role === "player2") paddle2Direction = 1;
			else if (role === "player3") paddle3Direction = 1;
			else if (role === "player4") paddle4Direction = 1;
		});

		socket.on("arrowUpRelease", () => {
			if (gameOver) return;
			if (role === "player1") paddle1Direction = 0;
			else if (role === "player2") paddle2Direction = 0;
			else if (role === "player3") paddle3Direction = 0;
			else if (role === "player4") paddle4Direction = 0;
		});

		socket.on("arrowDownRelease", () => {
			if (gameOver) return;
			if (role === "player1") paddle1Direction = 0;
			else if (role === "player2") paddle2Direction = 0;
			else if (role === "player3") paddle3Direction = 0;
			else if (role === "player4") paddle4Direction = 0;
		});
		socket.on("speed", (speed) => {
			if (gameOver) return;
			if (role === "player1") paddle1Speed = board.height / speed;
			else if (role === "player2") paddle2Speed = board.height / speed;
			else if (role === "player3") paddle3Speed = board.height / speed;
			else if (role === "player4") paddle4Speed = board.height / speed;
		});
		socket.on("disconnect", () => {
			if (role === "player1")
				players.player1.socket = null;
			else if (role === "player2")
				players.player2.socket = null;
			else if (role === "player3")
				players.player3.socket = null;
			else if (role === "player4")
				players.player4.socket = null;
		});
	};

	const sockets = await io.in(roomName).fetchSockets();
	sockets.forEach(socket => {
		if (socket.username === user1Id) {
			players.player1.socketId = socket.id;
			players.player1.socket = socket;
			attachListeners(socket, "player1");
		}
		else if (socket.username === user2Id) {
			players.player2.socketId = socket.id;
			players.player2.socket = socket;
			attachListeners(socket, "player2");
		}
		else if (socket.username === user3Id) {
			players.player3.socketId = socket.id;
			players.player3.socket = socket;
			attachListeners(socket, "player3");
		}
		else if (socket.username === user4Id) {
			players.player4.socketId = socket.id;
			players.player4.socket = socket;
			attachListeners(socket, "player4");
		}
	});

	io.to(roomName).emit("start");
	resizeBoard();

	let paddle1 = {
		width: board.width * 0.02,
		height: board.height * 0.15,
		x: 0,
		y: 0,
		Direction: 0,
		Score: 0
	};

	let paddle2 = {
		width: board.width * 0.02,
		height: board.height * 0.15,
		x: board.width * 0.25,
		y: board.height - board.height * 0.15,
		Direction: 0,
		Score: 0
	};
	let paddle3 = {
		width: board.width * 0.02,
		height: board.height * 0.15,
		x: board.width - board.width * 0.02,
		y: 0,
		Direction: 0,
		Score: 0
	};
	let paddle4 = {
		width: board.width * 0.02,
		height: board.height * 0.15,
		x: board.width - board.width * 0.27,
		y: board.height - board.height * 0.15,
		Direction: 0,
		Score: 0
	};

	let paddle1Score = 0;
	let paddle2Score = 0;
	let ballSpeed = 0;
	let ballX;
	let ballY;
	let ballXDirection;
	let ballYDirection;
	let intervalID;
	let ballRadius = board.width * 0.0125;

	function resizeBoard() {
		board.width = 1600;
		board.height = 900;
	}

	function createBall() {
		ballSpeed = board.width * 0.002;

		const minY = board.height / 3;
		const maxY = (board.height * 3) / 4;
		ballY = minY + Math.random() * (maxY - minY);
		ballX = board.width / 2;

		const minAngle = 30 * (Math.PI / 180);
		const maxAngle = 50 * (Math.PI / 180);
		const direction = Math.random() > 0.5 ? 1 : -1;

		const angle = minAngle + Math.random() * (maxAngle - minAngle);

		ballXDirection = Math.cos(angle) * direction;
		ballYDirection = Math.sin(angle);
	}

	function movePaddles() {
		if (paddle1Direction !== 0) {
			let newY = paddle1.y + paddle1Speed * paddle1Direction;
			paddle1.y = Math.max(0, Math.min(newY, board.height - paddle1.height));
			io.to(roomName).emit("paddle1", paddle1.y);
		}
		if (paddle2Direction !== 0) {
			let newY = paddle2.y + paddle2Speed * paddle2Direction;
			paddle2.y = Math.max(0, Math.min(newY, board.height - paddle2.height));
			io.to(roomName).emit("paddle2", paddle2.y);
		}
		if (paddle3Direction !== 0) {
			let newY = paddle3.y + paddle3Speed * paddle3Direction;
			paddle3.y = Math.max(0, Math.min(newY, board.height - paddle3.height));
			io.to(roomName).emit("paddle3", paddle3.y);
		}
		if (paddle4Direction !== 0) {
			let newY = paddle4.y + paddle4Speed * paddle4Direction;
			paddle4.y = Math.max(0, Math.min(newY, board.height - paddle4.height));
			io.to(roomName).emit("paddle4", paddle4.y);
		}
	}
	function add(board) {
		if (ballSpeed < board.width * 0.006) {
			ballSpeed += board.width * 0.0005;
		}
	}

	const checkPaddleCollision = (paddle) => {

		const closestX = Math.max(paddle.x, Math.min(ballX, paddle.x + paddle.width));
		const closestY = Math.max(paddle.y, Math.min(ballY, paddle.y + paddle.height));

		const distanceX = ballX - closestX;
		const distanceY = ballY - closestY;
		const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

		if (distanceSquared < (ballRadius * ballRadius)) {

			const paddleCenterX = paddle.x + paddle.width / 2;
			const paddleCenterY = paddle.y + paddle.height / 2;

			const overlapX = (paddle.width / 2 + ballRadius) - Math.abs(ballX - paddleCenterX);
			const overlapY = (paddle.height / 2 + ballRadius) - Math.abs(ballY - paddleCenterY);

			if (overlapY < overlapX) {
				ballYDirection = -ballYDirection;

				if (ballY < paddleCenterY) {
					ballY = paddle.y - ballRadius;
				} else {
					ballY = paddle.y + paddle.height + ballRadius;
				}

				ballY = Math.max(ballRadius, Math.min(ballY, board.height - ballRadius));

			} else {
				ballXDirection = -ballXDirection;
				add(board);

				if (ballX < paddleCenterX) {
					ballX = paddle.x - ballRadius;
				} else {
					ballX = paddle.x + paddle.width + ballRadius;
				}
			}
		}
	};

	function moveBall() {
		ballX += ballSpeed * ballXDirection;
		ballY += ballSpeed * ballYDirection;

		if (ballSpeed === 0) {
			io.to(roomName).emit("update", {
				ballX: 1700, ballY: 1000,
				paddle1Y: paddle1.y,
				paddle2Y: paddle2.y
			});
			return;
		}
		if (ballY - ballRadius < 0) {
			ballYDirection = -ballYDirection;
			ballY = 0 + ballRadius;
		}
		if (ballY + ballRadius > board.height) {
			ballYDirection = -ballYDirection;
			ballY = board.height - ballRadius;
		}
		checkPaddleCollision(paddle1);
		checkPaddleCollision(paddle2);
		checkPaddleCollision(paddle3);
		checkPaddleCollision(paddle4);

		if (ballX + ballRadius < 0) {
			paddle2Score++;
			resetBall();
		} else if (ballX - ballRadius > board.width) {
			paddle1Score++;
			resetBall();
		}
		io.to(roomName).emit("update", {
			ballX, ballY,
			paddle1Y: paddle1.y,
			paddle2Y: paddle2.y
		});
	}

	function checkWinner() {
		if (paddle1Score === 5 || paddle2Score === 5) {
			gameOver = true;
			stopGameLoop();
			const winner =
				paddle1Score === 5
					? "player1 player2"
					: "player3 player4";
			io.to(roomName).emit("finish", winner);
			if (onEnd) onEnd(roomName, user1Id, user2Id, user3Id, user4Id);
		}
	}

	function resetBall() {
		io.to(roomName).emit("score", { paddle1Score, paddle2Score });
		ballSpeed = 0;
		setTimeout(() => {
			createBall();
		}, 500);
		checkWinner();
	}

	function startGameLoop() {
		intervalID = setInterval(() => {
			movePaddles();
			moveBall();
		}, 10);
	}

	function stopGameLoop() {
		clearInterval(intervalID);
	}
	setTimeout(() => {
		createBall();
	}, 1000);
	startGameLoop();
	return {
		reconnectPlayer: (userId, newSocket) => {
			let role = null;
			console.log("midirtra " + userId);
			let allPlayersNames = [user1Id, user2Id, user3Id, user4Id];
			if (userId === players.player1.userId) {
				newSocket.emit("role", "player1");
				newSocket.emit("players_info", allPlayersNames);
				role = "player1";
			}
			else if (userId === players.player2.userId) {
				newSocket.emit("role", "player2");
				newSocket.emit("players_info", allPlayersNames);
				role = "player2";
			}
			else if (userId === players.player3.userId) {
				newSocket.emit("role", "player3");
				newSocket.emit("players_info", allPlayersNames);
				role = "player3";
			}
			else if (userId === players.player4.userId) {
				newSocket.emit("role", "player4");
				newSocket.emit("players_info", allPlayersNames);
				role = "player4";
			}
			if (role) {
				if (players[role].socket) {
					removeListeners(players[role].socket);
					players[role].socket.emit("removed");
				}
				players[role].socket = newSocket;
				players[role].socketId = newSocket.id;
				attachListeners(newSocket, role);

				newSocket.emit("ready");
				setTimeout(() => {
					newSocket.join(roomName);
					newSocket.emit("score", { paddle1Score, paddle2Score });
					newSocket.emit("paddle2", paddle2.y);
					newSocket.emit("paddle1", paddle1.y)
				}, 500)

				return true;
			}
			return false;
		},
		stop: () => stopGameLoop()
	};

}
