import { getHour } from "../Chat/MessageList";

interface MatchInterface {
	player1: string;
	player2: string;
	winner: string;
	score_p1: number;
	score_p2: number;
	played_at: string;
}

interface OverlaySubMatchProps {
	match: MatchInterface;
	onClose: () => void;
}

function OverlaySubMatch({ match, onClose }: OverlaySubMatchProps) {
	const isP1Winner = match.winner === match.player1;

	return (
			<div className="bg-gray-800 rounded-2xl w-full p-4 md:p-6 text-gray-200 transform scale-100 transition-transform duration-300 mb-5">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-lg font-bold tracking-wide">Match Summary</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white transition">✕</button>
				</div>
				<div className="bg-gray-900 rounded-xl p-6 shadow-inner">
					<div className="grid grid-cols-3 items-center text-center">
						<div className="flex flex-col gap-2">
							<span className="text-sm text-gray-400">Player 1</span>
							<span className={`text-lg font-semibold ${isP1Winner ? "text-green-400" : "text-gray-200"}`}>
								{match.player1}
							</span>
						</div>
						<div className="flex items-center justify-center gap-3">
							<span className="text-3xl font-extrabold text-white">
								{match.score_p1}
							</span>
							<span className="text-xl text-gray-400">-</span>
							<span className="text-3xl font-extrabold text-white">
								{match.score_p2}
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<span className="text-sm text-gray-400">Player 2</span>
							<span className={`text-lg font-semibold ${!isP1Winner ? "text-green-400" : "text-gray-200"}`}>
								{match.player2}
							</span>
						</div>
					</div>
				</div>
				<div className="mt-6 flex justify-center">
					<div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-6 py-3 flex items-center gap-3">
						<span className="text-2xl">🏆</span>
						<span className="font-semibold text-indigo-400">
							Winner: {match.winner}
						</span>
					</div>
				</div>
				<div className="mt-4 text-center text-sm text-gray-400 italic">
					Played at: {getHour(match.played_at)}
				</div>
				<div className="mt-8 flex justify-center">
					<button
						onClick={onClose}
						className="px-8 py-2 bg-indigo-500 text-white font-semibold rounded-md
							hover:bg-indigo-600 transition shadow-lg">
						Close
					</button>
				</div>
			</div>
	);
}

export default OverlaySubMatch;
