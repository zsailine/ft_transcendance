import { useEffect, useState } from "react";
import { start } from "../../../Pong/tournamentGame";
import { useContext } from "react";
import { hoverEffect } from "../../../Utils/style.ts";
import { UserContext } from "../../../Providers/TournamentProvider"
import { useDashboard} from "../../../Providers/DashboardProvider";
import OverlayLoading from "../../../Components/pong/OverlayLoading.tsx";
import OverlayResult from "../../../Components/pong/OverlayResult.tsx";
import { AnimatePresence } from "framer-motion";
import Board from "../../../Components/pong/Board.tsx";


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
						text={`${player[0]} vs ${player[1]}`} buttonText="Start"
						hoverEffect={hoverEffect} onQuit={startMatch} />
				)}
				{winner && (
					<OverlayResult key="overlay-result"
						buttonText="Next" winner={`${push} won`}
						onQuit={nextMatch} hoverEffect={hoverEffect} />
				)}
			</AnimatePresence>
		</>
	);
}

export default TournamentGame;