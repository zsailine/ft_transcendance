import { useOnlineTournament } from "../../Providers/OnlineTournamentProvider"

export default function StartTournament() {
	const { socket, id } = useOnlineTournament();
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
					d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z M10 8l6 4-6 4V8z"
				/>
			</svg>
			<span>Quit</span>
		</button>
	)
}