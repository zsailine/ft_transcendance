import { useEffect, useState } from "react";
import { start } from "../../../Pong/tournamentGame";
import { useContext } from "react";
import { hoverEffect } from "../../../Utils/style.ts";
import { UserContext } from "../../../Providers/TournamentProvider"
import { useDashboard, type ThemeColors } from "../../../Providers/DashboardProvider";
import OverlayLoading from "../../../Components/pong/OverlayLoading.tsx";
import OverlayResult from "../../../Components/pong/OverlayResult.tsx";
import { AnimatePresence } from "framer-motion";

function Board({ player, theme }: { player: string[], theme: ThemeColors }) {
	return (
		<div className="bg-gray-900 text-white flex flex-col items-center justify-center h-full font-sans">
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
				>{player[1]}</p>
			</div>
		</div>
	);
}

function TournamentGame() {
	const [loading, setLoading] = useState(true);
	const { theme } = useDashboard();
	const [match, setMatch] = useState(false);
	const [winner, setWinner] = useState(false);
	const [push, setPush] = useState("");
	const [newAliases, setNewAliases] = useState<string[]>([]);
	const [index, setIndex] = useState(0);
	const { aliases, setAliases } = useContext(UserContext);
	const [player, setPlayer] = useState<string[]>([]);
	const [numMatches] = useState(Math.floor(aliases.length / 2));
	const { setPages } = useContext(UserContext);
	function startMatch() {
		setLoading(false);
		setMatch(true);
	}
	function nextMatch() {
		if (index < numMatches - 1) {
			setIndex(index + 1);
			setLoading(true);
			setMatch(false);
			setWinner(false);
		}
		else {
			setAliases(newAliases);
			if (newAliases.length >= 2)
				setPages(2);
			else
				setPages(4);
		}
	}
	useEffect(() => {
		if (aliases.length >= 2) {
			const p1 = aliases[index * 2];
			const p2 = aliases[index * 2 + 1];
			setPlayer([p1, p2]);
		}
	}, [aliases, index]);
	useEffect(() => {
		if (match) {
			if (!theme) return;
			const addWinner = (toAdd: string) => {
				setPush(toAdd);
				setNewAliases(prev => [...prev, toAdd]);
				setWinner(true);
			}

			const clean = start(theme, player, addWinner);
			return clean;
		}
	}, [match]);
	return (
		<>
			{theme && <Board player={player} theme={theme} />}
			<AnimatePresence mode="wait">
				{loading && (
					<OverlayLoading key="overlay-loading"
						text={`${player[0]} vs ${player[1]}`} buttonText="next"
						hoverEffect={hoverEffect} onQuit={startMatch} />
				)}
				{winner && (
					<OverlayResult key="overlay-result"
						buttonText="Home" winner={`${push} won`}
						onQuit={nextMatch} hoverEffect={hoverEffect} />
				)}
			</AnimatePresence>
		</>
	);
}

export default TournamentGame;