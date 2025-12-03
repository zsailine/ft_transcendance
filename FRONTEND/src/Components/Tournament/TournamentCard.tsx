import { useOnlineTournament } from "../../Providers/OnlineTournamentProvider";
const TournamentCard = ({ name, currentPlayers, maxPlayers, status, id }: any) => {
	const isFull = currentPlayers >= maxPlayers;
	const progressPercentage = (currentPlayers / maxPlayers) * 100;
	const {socket} = useOnlineTournament();
	function joinTournament() {
		if (!socket) return;
		socket.emit("join tournament", id);
	}
	return (
		<div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between h-64">
			<div className="flex justify-between items-start mb-4">
				<h3 className="text-xl font-bold text-white truncate w-3/4" title={name}>
					{name}
				</h3>
				<span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider 
					${isFull ? 'bg-red-900/50 text-red-400 border border-red-700' : 'bg-green-900/50 text-green-400 border border-green-700'}`}>
					{status}
				</span>
			</div>

			<div className="mb-6">
				<div className="flex justify-between text-sm text-gray-400 mb-2">
					<span>Participants</span>
					<span className="text-white font-mono">{currentPlayers} / {maxPlayers}</span>
				</div>
				<div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
					<div 
						className={`h-2.5 rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-cyan-400'}`}
						style={{ width: `${progressPercentage}%` }}
					></div>
				</div>
			</div>

			<button
				disabled={isFull}
				onClick={joinTournament}
				className={`w-full py-3 rounded-lg font-bold text-sm transition-colors duration-200
					${isFull 
						? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
						: 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
					}`}
			>
				{isFull ? 'Spectate' : 'Join Tournament'}
			</button>
		</div>
	);
};

export default TournamentCard;