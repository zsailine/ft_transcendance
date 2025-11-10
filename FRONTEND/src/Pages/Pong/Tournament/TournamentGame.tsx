import { useEffect, useState } from "react";
import { start } from "../../../Pong/tournamentGame";
import { useContext } from "react";
import { hoverEffect } from "../../../Utils/style.ts";
import { UserContext } from "../../../Providers/TournamentProvider"

function Board({ player }: { player: string[] }) {
	return (
		<div className="bg-gray-900 text-white flex flex-col items-center justify-center h-full font-sans">
			<div id="MainBoard" className="flex h-[60%] w-[70%] mx-auto">
				<p id="player1" className="font-bold [writing-mode:vertical-rl] rotate-180 text-center">{player[0]}</p>
				<canvas id="board" className="border-4 border-white rounded-lg bg-green-700 h-full w-full shadow-lg"></canvas>
				<p id="player2" className="font-bold [writing-mode:vertical-rl] text-center">{player[1]}</p>
			</div>
		</div>
	);
}

function Loading({
	player,
	onClick,
}: {
	player: string[];
	onClick: () => void;
}) {
	return (
		<div className="absolute z-10 top-0 w-[100%] h-[100%] flex flex-col items-center justify-center 
				bg-black/30 backdrop-blur-[2px] text-white">
			<h1 id="pending" className="text-4xl text-center text-cyan- font-bold mb-6">{player[0]} vs {player[1]}</h1>
			<div
				className={`cursor-pointer mr-1.5 py-1.5 px-6 text-xl flex items-center h-max gap-2 backdrop-blur-xl rounded-xl
						bg-cyan-800/5 shadow-md shadow-cyan-500/50 ${hoverEffect}`}
				onClick={onClick}>
				Start
			</div>
		</div>
	)
}

function Winner({ push, onClick }: { push: string; onClick: () => void }) {
	return (
		<div className="absolute z-10 top-0 w-[100%] h-[100%] flex flex-col items-center justify-center 
			bg-black/30 backdrop-blur-[2px] text-white">
			<h1  className="text-4xl text-center text-cyan- font-bold mb-6">{push} won</h1>
			<div
				className={`cursor-pointer mr-1.5 py-1.5 px-6 text-xl flex items-center h-max gap-2 backdrop-blur-xl rounded-xl
						bg-cyan-800/5 shadow-md shadow-cyan-500/50 ${hoverEffect}`}
				onClick={onClick}>
				Next
			</div>
		</div>
	)
}

function TournamentGame() {
	const [loading, setLoading] = useState(true);
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
		if (index < numMatches - 1)
		{
			setIndex(index + 1);
			setLoading(true);
			setMatch(false);
			setWinner(false);
		}
		else
		{
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
		  const addWinner = (toAdd: string) => {
			setPush(toAdd);
			setNewAliases(prev => [...prev, toAdd]);
			setWinner(true);
		  }
	  
		  const clean = start(player, addWinner);
		  return clean;
		}
	  }, [match]);
	return (
		<>
			<Board player={player} />
			{loading && (
				<Loading player={player} onClick={startMatch} />
			)}
			{winner && (
				<Winner push={push} onClick={nextMatch} />
			)}
		</>
	);
}

export default TournamentGame;