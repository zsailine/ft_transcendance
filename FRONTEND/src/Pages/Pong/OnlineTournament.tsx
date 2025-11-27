import  { useState } from 'react';

interface TournamentProps {
    name: string;
    currentPlayers: number;
    maxPlayers: number;
    status: string;
}

// Données fictives
const mockTournaments = [
    { id: 1, name: "Thunderdome Cup", currentPlayers: 4, maxPlayers: 8, status: "Open" },
    { id: 2, name: "Neon Nights", currentPlayers: 8, maxPlayers: 8, status: "Full" },
    { id: 3, name: "Weekly Rumble", currentPlayers: 2, maxPlayers: 16, status: "Open" },
    { id: 4, name: "Pro League Qualifier", currentPlayers: 14, maxPlayers: 32, status: "Open" },
    { id: 5, name: "Sunday Chill", currentPlayers: 1, maxPlayers: 4, status: "Open" },
    { id: 6, name: "Devs Battle", currentPlayers: 6, maxPlayers: 10, status: "Open" },
];

const TournamentCard = ({ name, currentPlayers, maxPlayers, status } : TournamentProps) => {
    const isFull = currentPlayers >= maxPlayers;
    const progressPercentage = (currentPlayers / maxPlayers) * 100;

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

export default function TournamentList() {
    const [searchTerm, setSearchTerm] = useState("");

    // Logique de filtrage
    const filteredTournaments = mockTournaments.filter(tournament => 
        tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
            
            {/* EN-TÊTE & CONTRÔLES */}
            <div className="max-w-7xl mx-auto mb-10 flex flex-col lg:flex-row justify-between items-center gap-6">
                
                {/* Titre */}
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                        Active Tournaments
                    </h1>
                    <p className="text-gray-400 mt-2">Find your arena and compete.</p>
                </div>

                {/* Barre d'action (Search + Create) */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    
                    {/* Barre de Recherche */}
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {/* Icône Loupe SVG */}
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search tournament..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm transition duration-150 ease-in-out"
                        />
                    </div>

                    {/* Bouton Créer */}
                    <button 
                        onClick={() => alert("Open Create Modal")} 
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-2 rounded-lg font-bold shadow-lg transition transform hover:scale-105"
                    >
                        {/* Icône Plus SVG */}
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create</span>
                    </button>
                </div>
            </div>

            {filteredTournaments.length > 0 ? (
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTournaments.map((tournament) => (
                        <TournamentCard 
                            key={tournament.id}
                            {...tournament}
                        />
                    ))}
                </div>
            ) : (
                // Message si aucun résultat
                <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
                    <svg className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xl">No tournament found for "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
}