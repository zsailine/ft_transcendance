import { useEffect, useState } from "react";
import { start } from "../../OnlinePong/start.ts";
import { useNavigate, useLocation } from "react-router-dom"
import { useDashboard } from "../../Providers/DashboardProvider";
import io, { Socket } from "socket.io-client";
import { hoverEffect } from "../../Utils/style.ts";
import OverlayLoading from "../../Components/pong/OverlayLoading.tsx";
import OverlayResult from "../../Components/pong/OverlayResult.tsx";
import { AnimatePresence } from "framer-motion";
import { useOnlineGame } from "../../Providers/OnlineGameProvider.tsx";
import OverlayInput from "../../Components/pong/OverlayInput.tsx";

export function generateRoom() {
	const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMBNOPQRSTUVWXYZ123456789"
	let i = 0;
	let result = "";
	while (i < 26) {
		result += alphabet[Math.floor(Math.random() * 61)];
		i++;
	}
	return (result);
}

function OnlineGame() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [create, setCreate] = useState(false);
	const [join, setJoin] = useState(false);
	const [link, setLink] = useState("");
	const [overlay, setOverlay] = useState(false);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [winner, setWinner] = useState<string>("");
	const [role, setRole] = useState<string>("");
	const [opponent, setOpponent] = useState("");
	const [begin, setBegin] = useState(false);
	const [player, setPLayer] = useState<string[]>(["player1", "player2"])
	const { theme, username } = useDashboard();
	const { text } = useOnlineGame();
	const navigate = useNavigate();
	const location = useLocation();

	const queryParams = new URLSearchParams(location.search);
	const mode = queryParams.get("mode") || "quick";


	useEffect(() => {
		const s = io("http://localhost:3005/");
		setSocket(s);
		if (mode === "create") {
			const room = generateRoom();
			setLink(room);
			setCreate(true);
			s.emit("create quick", { username, room });
		}
		else if (mode === "join") {
			setJoin(true);
		}
		else {
			s.emit("quick", username);
			setLoading(true);
		}
		s.on("ready", () => {
			setBegin(true);
		});

		s.on("role", data => {
			setRole(data);
		});
		s.on("opponent", data => {
			setOpponent(data);
		})
		s.on("duplicate", () => {
			setLoading(false);
			setJoin(false);
			setCreate(false);
			setError(true);
		});
		return () => {
			s.disconnect();
		};
	}, []);
	useEffect(() => {
		if (opponent.length && role.length && username)
			role === "player1" ? setPLayer([username, opponent]) : setPLayer([opponent, username]);
	}, [opponent, role])
	useEffect(() => {
		if (!begin || !socket || !theme) return;
		setLoading(false);
		setJoin(false);
		setCreate(false);
		const clean = start(
			theme,
			socket,
			(winnerRole: string) => {
				setWinner(winnerRole);
				setOverlay(true);
			},
		);
		return () => {
			clean();
		};
	}, [begin, socket]);


	function handleQuit() {
		if (socket) {
			socket?.disconnect();
			navigate("/dashboard/play");
		}
	}
	function joinRoom(e: React.FormEvent) {
		e.preventDefault();
		socket?.emit("join quick", { username, text });
	}
	return (
		<div className="h-full">
			<div className="text-white flex flex-col items-center justify-center font-sans">
				<div id="MainBoard" className="flex h-[60%] w-[70%] mx-auto">
					<p
						id="player1"
						className="font-bold [writing-mode:vertical-rl] rotate-180 text-center"
						style={{ color: theme?.paddle1 }}
					>{player[0]}</p>
					<canvas id="board" className="border-4 rounded-lg h-full w-full shadow-lg"
						style={{ backgroundColor: theme?.boardBackground, borderColor: theme?.boardBorder }}
					></canvas>
					<p
						id="player2"
						className="font-bold [writing-mode:vertical-rl] rotate-180 text-center"
						style={{ color: theme?.paddle2 }}
					>{player[1]} </p>
				</div>
			</div>

			<AnimatePresence mode="wait">
				{overlay && (
					<OverlayResult
						key="overlay-result"
						buttonText="Home"
						winner={winner === role ? "You win ! 🏆" : "You lose ! 🤕"}
						onQuit={handleQuit}
						hoverEffect={hoverEffect}
					/>
				)}
				{loading && (
					<OverlayLoading
						key="overlay-loading"
						text="Waiting for another player"
						buttonText="Home"
						onQuit={handleQuit}
						hoverEffect={hoverEffect}
					/>
				)}
				{create && (
					<OverlayLoading
						key="overlay-loading"
						text=<>
							{link}
							<br />
							Copy to join
						</>
						buttonText="Home"
						onQuit={handleQuit}
						hoverEffect={hoverEffect}
					/>
				)}
				{error && (
					<OverlayLoading
						key="overlay-loading"
						text="You are already on a match"
						buttonText="Home"
						onQuit={handleQuit}
						hoverEffect={hoverEffect}
					/>
				)}
				{join && (
					<OverlayInput
						key="overlay-input"
						buttonText="Home"
						handleSubmit={joinRoom}
						onQuit={handleQuit}
						hoverEffect={hoverEffect}
					/>
				)}
			</AnimatePresence>

		</div>
	);
}

export default OnlineGame;