import { useContext, useState } from "react";
import { UserContext } from "../../../Providers/TournamentProvider";

export default function MatchMaking() {
	const { aliases, setPages } = useContext(UserContext);
	const [numMatches] = useState(Math.floor(aliases.length / 2));

	return (
		<div className="flex flex-col items-center space-y-6 w-full">
			<h2 className="text-2xl font-bold text-yellow-400 mb-4">Matchmaking</h2>
 
			{Array.from({ length: numMatches }).map((_, i) => (
				<div
					key={i}
					className="bg-gray-800 text-white rounded p-4 w-64 text-center"
				>
					{aliases[i * 2]} vs {aliases[i * 2 + 1]}
				</div>
			))}

			<button
				onClick={() => setPages(3)}
				className="bg-yellow-400 text-black px-4 py-2 rounded"
			>
				Start
			</button>
		</div>
	);
}
