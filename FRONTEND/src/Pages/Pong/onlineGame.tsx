import { useEffect, useState } from "react";
import { start } from "../../OnlinePong/start.ts";
import { useNavigate, useLocation } from "react-router-dom"
import { useDashboard } from "../../Providers/DashboardProvider";
import io, { Socket } from "socket.io-client";
import { hoverEffect } from "../../Utils/style.ts";
import OverlayLoading from "../../Components/pong/OverlayLoading.tsx";
import OverlayResult from "../../Components/pong/OverlayResult.tsx";
import { alpha, AnimatePresence } from "framer-motion";
import { useOnlineGame } from "../../Providers/OnlineGameProvider.tsx";
import OverlayInput from "../../Components/pong/OverlayInput.tsx";
import { generateRoom } from "../../Utils/tools.ts";

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
	const [errorMessage, setErrorMessage] = useState("");
	const [enter, setEnter] = useState(false);
	const [player, setPLayer] = useState<string[]>(["player1", "player2"])
	const { theme, username } = useDashboard();
	const { text, setText } = useOnlineGame();
	const navigate = useNavigate();
	const location = useLocation();

	const queryParams = new URLSearchParams(location.search);
	const mode = queryParams.get("mode") || "quick";
	const path = queryParams.get("link") || "";

	useEffect(() => {
		if (!username) return;
		const s = io("http://localhost:3005/");
		setSocket(s);
		if (mode === "create") {
			const room = path.length > 0 ? path : generateRoom();
			setLink(room);
			setCreate(true);
			s.emit("create quick", { username, room });
		}
		else if (mode === "join") {
			if (path.length) {
				setText(path);
				setEnter(true);
			}
			else
				setJoin(true);
		}
		else if (mode === "quick") {
			s.emit("quick", username);
			setLoading(true);
		}
		else if (mode === "invite")
		{
			const room = path.length ? path : generateRoom();
			s.emit("invite", {room, username});
			setLoading(true);
		}
		else
			displayError("Oops an error occured");
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
			displayError("You are already on a match");
		});
		s.on("exist", () => {
			displayError("This room already exist");
		})
		s.on("don't exist", () => {
			displayError("This room doesn't exist");
		})
		return () => {
			s.disconnect();
		};
	}, [username]);
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
	useEffect(() => {
		if (socket && text.length && enter)
			joinRoom(null);
	}, [socket, text, enter]);

	function displayError(text: string) {
		setLoading(false);
		setJoin(false);
		setCreate(false);
		setError(true);
		setErrorMessage(text);
	}
	function handleQuit() {
		if (socket) {
			socket?.disconnect();
			navigate("/dashboard/play");
		}
	}
	function joinRoom(e: React.FormEvent | null) {
		if (e !== null)
			e.preventDefault();
		const room = text;
		socket?.emit("join quick", { username, room });
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
						text={errorMessage}
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