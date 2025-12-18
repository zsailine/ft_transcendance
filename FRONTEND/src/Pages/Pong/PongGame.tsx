import { useEffect, useState } from "react";
import { initGame } from "../../Pong/game.ts";
import { useNavigate } from "react-router-dom"
import { useDashboard } from "../../Providers/DashboardProvider";
import Board from "../../Components/pong/Board.tsx";
import { AnimatePresence } from "framer-motion";
import OverlayResult from "../../Components/pong/OverlayResult.tsx";
import { hoverEffect } from "../../Utils/style.ts";
import { start } from "../../Pong/tournamentGame.ts";

function PongGame() {
	const navigate = useNavigate();
	const { theme } = useDashboard();
	const [winner, setWinner] = useState(false);
	const [push, setPush] = useState("");
	const player = ["player1", "player2"];
	useEffect(() => {
		if (!theme) return;
		const addWinner = (toAdd: string) => {
			setPush(toAdd);
			setWinner(true);
		}

		const clean = start(theme, player, addWinner);
		return () => clean();
	}, [theme]);

	function handleQuit() {
		navigate("/dashboard/play");
	}

	return (
		<>
			{theme && <Board player={player} theme={theme}/>}
			<AnimatePresence mode="wait">
				{winner && (
					<OverlayResult key="overlay-result"
						buttonText="Next" winner={`${push} won`}
						onQuit={handleQuit} hoverEffect={hoverEffect} />
				)}
			</AnimatePresence>
		</>
	);
}

export default PongGame;