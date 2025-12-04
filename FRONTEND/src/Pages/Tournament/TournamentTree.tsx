import React, { type FC } from 'react';

export interface TournamentMatch {
	matchId: string,
	round: number,
	player1: string,
	player2: string,
	winner: string
}
export interface TournamentInterface {
	id: string;
	name: string;
	maxPlayers: number;
	players: any;
	currentPlayers: number;
	status: "waiting" | "playing" | "Full";
	matches: TournamentMatch[];
}
export function TournamentTree({ tournament }: { tournament: TournamentInterface | null }) {
	if (!tournament) return <div>Chargement du tournoi...</div>;
	const playersList = Object.entries(tournament.players);
	console.log(playersList);
	const emptySlotsCount = Math.max(0, tournament.maxPlayers - tournament.currentPlayers);
	const emptySlots = Array(emptySlotsCount).fill(null);
	const getGridCols = (maxPlayers: number) => {
		if (maxPlayers <= 4) return "grid-cols-2";
		if (maxPlayers <= 8) return "grid-cols-3";
		return "grid-cols-4";
	};

	return (
		// <h1 >hello</h1>
		<div className="p-5">
			<div className=" mb-4 flex justify-between items-center">
				<h2 className="text-xl font-semibold text-blue-600">
					Joueurs inscrits ({tournament.currentPlayers} / {tournament.maxPlayers})
				</h2>

				<span
					className={`
					px-3 py-1 rounded-full text-sm font-medium
					${tournament.status === "waiting"
							? "bg-cyan-100 text-cyan-700 border border-cyan-300"
							: "bg-blue-100 text-blue-700 border border-blue-300"
						}
				`}
				>
					{tournament.status === "waiting" ? "En attente" : "En cours"}
				</span>
			</div>

			<div className={`w-[80vw] mx-auto grid gap-4 mt-5 ${getGridCols(tournament.maxPlayers)}`}>
				{playersList.map(([id, player]) => (
					<div
						key={id}
						className="border border-cyan-400 rounded-xl p-4 shadow-sm flex flex-col items-center text-center min-h-[110px] shadow-blue-200"
					>
						<div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
							{player.name.charAt(0).toUpperCase()}
						</div>
						<div className="mt-2 text-lg font-semibold text-blue-700">
							{player.name}
						</div>
					</div>
				))}

				{/* Slots libres */}
				{emptySlots.map((_, index) => (
					<div
						key={`empty-${index}`}
						className="border-2 border-dashed border-cyan-400 rounded-xl p-4 text-blue-600 flex items-center justify-center min-h-[110px]"
					>
						Slot disponible
					</div>
				))}
			</div>
		</div>

	);
}
