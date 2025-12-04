import { useState, useMemo, useEffect } from 'react';
import { useOnlineTournament } from '../../Providers/OnlineTournamentProvider';
import { IoMdClose } from "react-icons/io";

export default function TournamentForm() {
	const [name, setName] = useState('');
	const [maxPlayers, setMaxPlayers] = useState(4);
	const { socket, setPage } = useOnlineTournament()

	const validation = useMemo(() => {
		let error = null;
		const trimmedName = name.trim();
		if (name.length && trimmedName.length < 3) {
			error = "Minimum 3 characters";
		} else if (name.length > 30) {
			error = "Maximum 30 characters";
		}

		return {
			error,
			isValid: !error && trimmedName.length >= 3
		};
	}, [name]);
	const error = validation.error;
	const inputClassName = [
		"w-full px-4 py-2 bg-gray-700 border rounded-lg transition duration-150",
		"focus:outline-none",
		error
			? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
			: "border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
	].join(" ");

	const handleSubmit = (e: any) => {
		e.preventDefault();
		if (!validation.isValid || !socket) return;
		socket.emit("create tournament", { name, maxPlayers });
	};
	useEffect(() => {
		if (!socket) return;

		const handler = (data: string) => { socket.emit("join tournament", data); setPage(1) };
		socket.on("created", handler);

		return () => {
			socket.off("created", handler);
		};
	}, [socket]);


	return (
		<div className="relative p-6 bg-gray-800 text-white rounded-xl shadow-2xl w-full max-w-sm mx-auto">
			<div className="absolute top-4 right-4 text-blue-500 text-3xl cursor-pointer">
                <IoMdClose onClick={() => setPage(1)} />
            </div>
			<h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
				Create a new tournament
			</h2>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label htmlFor="tournamentName" className="block text-sm font-medium text-gray-300 mb-1">
						Tournament name
					</label>
					<input
						type="text"
						id="tournamentName"
						placeholder="Ex: Thunderdome Cup"
						className={inputClassName}
						value={name}
						onChange={(e) => setName(e.target.value)}
						title={error || ""}
						required
					/>
				</div>
				<div>
					<label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-300 mb-1">
						Number of players (4, 8 ou 16)
					</label>

					<select
						id="maxPlayers"
						value={maxPlayers}
						onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
						required
						className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-white"
					>
						<option value="4">4 players</option>
						<option value="8">8 players</option>
						<option value="16">16 players</option>
					</select>

				</div>
				<button
					type="submit"
					disabled={!validation.isValid}
					className={`w-full flex items-center justify-center space-x-2 px-5 py-2 rounded-lg font-bold 
						shadow-lg transition transform 
                                ${!validation.isValid
							? 'bg-gray-600 text-gray-400 cursor-not-allowed'
							: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white hover:scale-105' // Style activé
						}`}
				>
					<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
					</svg>
					<span>Create tournament</span>
				</button>
			</form>
		</div>
	);
}