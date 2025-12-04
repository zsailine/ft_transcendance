import { useOnlineTournament } from "../../Providers/OnlineTournamentProvider"

export default function CreateTournament() {
	const {setPage} = useOnlineTournament();
	return (
		<>
			<button
				onClick={() => setPage(2)}
				className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 
                        to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-2 rounded-lg font-bold shadow-lg 
                        transition transform hover:scale-105"
			>
				<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
				</svg>
				<span>Create</span>
			</button>
		</>
	)
}