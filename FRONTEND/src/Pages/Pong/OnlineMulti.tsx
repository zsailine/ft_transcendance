import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { useDashboard } from "../../Providers/DashboardProvider";
import io, { Socket } from "socket.io-client";
import { hoverEffect } from "../../Utils/style.ts";
import OverlayLoading from "../../Components/pong/OverlayLoading.tsx";
import OverlayResult from "../../Components/pong/OverlayResult.tsx";
import { AnimatePresence } from "framer-motion";
import { startonline } from "../../OnlinePong/startOnline.ts";

function OnlineMulti() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [overlay, setOverlay] = useState(false);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [winner, setWinner] = useState<string>("");
	const [role, setRole] = useState<string>("");
	const [begin, setBegin] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [player, setPlayer] = useState<string[]>(["player1", "player2", "player3", "player4"]);
	const { theme, username } = useDashboard();
	const navigate = useNavigate();

	useEffect(() => {
		if (!username) return;
		const s = io("http://localhost:3000", {
			withCredentials: true,
			path: "/online/socket.io",
			transports: ["websocket"],
		});
		setSocket(s);
		s.emit("multiplayer", username);
		s.on("ready", () => {
			setBegin(true);
		});

		s.on("role", data => {
			setRole(data);
		});
		s.on("duplicate", () => {
			displayError("You are already on a match");
		});
		s.on("players_info", (data: string[]) => {
			setPlayer(data);
		});
		return () => {
			s.disconnect();
		};
	}, [username]);
	useEffect(() => {
		if (!begin || !socket || !theme || player[0] === "player1") return;
		setLoading(false);
		const clean = startonline(
			role,
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
	}, [begin, socket, player]);

	function displayError(text: string) {
		setLoading(false);
		setError(true);
		setErrorMessage(text);
	}
	function handleQuit() {
		if (socket) {
			socket?.disconnect();
			navigate("/dashboard/play");
		}
	}
	return (
		<div className="h-full">
			<div className="text-white flex flex-col items-center justify-center font-sans h-screen w-full">
				<div id="MainBoard" className="flex h-[60%] w-[70%] mx-auto items-center">
					<div className="h-full flex flex-col justify-between py-4 -mr-1">
						<p
							id="player1"
							className="font-bold [writing-mode:vertical-rl] rotate-180 text-center"
							style={{ color: theme?.paddle1 }}
						>
							{player[0]}
						</p>
						<p
							id="player2"
							className="font-bold [writing-mode:vertical-rl] rotate-180 text-center"
							style={{ color: theme?.paddle1 }}
						>
							{player[1]}
						</p>
					</div>
					<canvas
						id="board"
						className="border-4 rounded-lg h-full flex-1 shadow-lg mx-4"
						style={{ backgroundColor: theme?.boardBackground, borderColor: theme?.boardBorder }}
					></canvas>
					<div className="h-full flex flex-col justify-between py-4 -ml-1">
						<p
							id="player3"
							className="font-bold [writing-mode:vertical-rl] text-center"
							style={{ color: theme?.paddle2 }}
						>
							{player[2]}
						</p>
						<p
							id="player4"
							className="font-bold [writing-mode:vertical-rl] text-center"
							style={{ color: theme?.paddle2 }}
						>
							{player[3]}
						</p>
					</div>

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
				{error && (
					<OverlayLoading
						key="overlay-loading"
						text={errorMessage}
						buttonText="Home"
						onQuit={handleQuit}
						hoverEffect={hoverEffect}
					/>
				)}
			</AnimatePresence>

		</div>
	);
}

export default OnlineMulti;