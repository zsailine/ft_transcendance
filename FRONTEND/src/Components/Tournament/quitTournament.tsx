import { useOnlineTournament } from "../../Providers/OnlineTournamentProvider"

export default function QuitTournament () {
	const { socket, id} = useOnlineTournament();
	function quit() {
		if (!socket) return;
		socket.emit("leave tournament", id);
	}
	return (
		<button
			onClick={quit}
			className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 
                    to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-2 
                    rounded-lg font-bold shadow-lg transition transform hover:scale-105"
		>
			<svg
				className="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M9 12h12m-9-7l-5 7 5 7"
				/>
			</svg>
			<span>Start</span>
		</button>
	)
}