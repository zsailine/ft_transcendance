import { useNavigate } from "react-router-dom"
import { useDashboard } from "../../Providers/DashboardProvider";
import { useEffect, useState } from "react";
import { gameAI } from "./Logic/game";
import { useAuth } from "../../Providers/AuthProvider";
import { AnimatePresence } from "framer-motion";
import OverlayResult from "../../Components/pong/OverlayResult";
import { hoverEffect } from "../../Utils/style";

function PongGameAI() {
	const [ result, setResult ] = useState<string>("");
	const [ overlay, setOverlay ] = useState<boolean>(false);
	const navigate = useNavigate();
	const { theme } = useDashboard();
	const { user } = useAuth();

	useEffect(() => {
		if (!theme) return;
		const clean = gameAI(theme, (winnerRole: string) => {
			setResult(winnerRole);
			setOverlay(true);
		});
		return () => clean();
	}, [theme]);

	function handleQuit() {
		navigate("/dashboard/play");
	}

	return (
		<>
			<div className="text-white flex flex-col items-center justify-center h-full font-sans gap-5">
				<div id="MainBoard" className="flex h-[60%] w-[70%] mx-auto">
					<p
						id="player1"
						className="font-bold [writing-mode:vertical-rl] rotate-180 text-center"
						style={{ color: theme?.paddle1 }}
					>{user}</p>
					<canvas id="board" className="border-4 rounded-lg h-full w-full shadow-lg"
							style={{backgroundColor: theme?.boardBackground, borderColor: theme?.boardBorder}}
					></canvas>
					<p
						id="player2"
						className="font-bold [writing-mode:vertical-rl] rotate-180 text-center uppercase"
						style={{ color: theme?.paddle2 }}
					>BOT</p>
				</div>
				<button id="rst"
					className="px-4 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-all">
					Reset
				</button>
				<button
					id="backBtn"
					onClick={handleQuit}
					className="px-3 py-1 mt-3 text-sm border border-gray-400 rounded hover:bg-gray-200 hover:text-gray-900 transition-all">
					Quit
				</button>
			</div>

			<AnimatePresence mode="wait">
				{ overlay && 
				<OverlayResult
					key="overlay-result"
					buttonText="Home"
					winner={result}
					onQuit={handleQuit}
					hoverEffect={hoverEffect}
				/>}
			</AnimatePresence>
		</>
	);
}

export default PongGameAI
