import Title from '../../Components/Tournament/header';
import SearchBar from '../../Components/Tournament/searchBar';
import CreateTournament from '../../Components/Tournament/CreateTournament';
import TournamentCard from '../../Components/Tournament/TournamentCard';
import { useOnlineTournament } from '../../Providers/OnlineTournamentProvider';

export default function Selection({ AllTournament }: { AllTournament: any[] }) {
	const { text } = useOnlineTournament();
	const filteredTournaments = AllTournament.filter((tournament: any) => {
		const matchesSearch = tournament.name.toLowerCase().includes(text.toLowerCase());
		const isWaiting = tournament.status === "waiting";
		return matchesSearch && isWaiting;
	});
	return (
		<div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
			<div className="max-w-7xl mx-auto mb-10 flex flex-col lg:flex-row justify-between items-center gap-6">
				<Title />
				<div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
					<SearchBar />
					<CreateTournament />
				</div>
			</div>
			{filteredTournaments.length > 0 ? (
				<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredTournaments.map((tournament, index) => (
						<TournamentCard
							key={index}
							{...tournament}
						/>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center mt-20 text-gray-500">
					<svg className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 
                        10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<p className="text-xl">No tournament found</p>
				</div>
			)}
		</div>
	)
}