import { useOnlineTournament } from "../../Providers/OnlineTournamentProvider"

export default function SearchBar() {
	const {text, setText} = useOnlineTournament();
	return (
		<>
			<div className="relative w-full">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					{/* Icône Loupe SVG */}
					<svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
				<input
					type="text"
					placeholder="Search tournament..."
					value={text}
					onChange={(e) => setText(e.target.value)}
					className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-800 text-gray-300 
                            placeholder-gray-500 focus:outline-none focus:bg-gray-700 focus:border-cyan-500 focus:ring-1 
                            focus:ring-cyan-500 sm:text-sm transition duration-150 ease-in-out"
				/>
			</div>
		</>
	)
}