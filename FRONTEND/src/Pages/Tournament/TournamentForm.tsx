import React, { useState, useMemo } from 'react';

export default function TournamentForm() {
	const [name, setName] = useState('');
	const [maxPlayers, setMaxPlayers] = useState(4);
	const [error, setError] = useState('');

	const nameError =
		name.length === 0
			? ""
			: name.length < 3
				? "Le nom doit contenir au moins 3 caractères."
				: "";

	// Utilisation de useMemo pour déterminer si le bouton doit être désactivé
	// Cela garantit que le bouton est mis à jour uniquement lorsque 'name' ou 'maxPlayers' change.
	const isFormInvalid = useMemo(() => {
		return nameError !== "";
	}, [nameError]);

	const handleSubmit = (e: any) => {
		e.preventDefault();
		setError('');

		// Double-vérification au cas où le bouton était désactivé et soumis via Enter
		if (isFormInvalid) {
			setError("Veuillez entrer un nom valide (au moins 3 caractères).");
			return;
		}

		const newTournament = {
			name: name,
			size: maxPlayers,
			status: 'waiting'
		};

		console.log("Tournoi à créer:", newTournament);
		alert(`Tournoi créé : ${name} (${maxPlayers} joueurs)`);
	};

	return (
		<div className="p-6 bg-gray-800 text-white rounded-xl shadow-2xl w-full max-w-sm mx-auto">
			<h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
				Créer un nouveau tournoi
			</h2>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* -------------------- Nom du Tournoi -------------------- */}
				<div>
					{/* AFFICHAGE DE L'ERREUR AU-DESSUS DE L'INPUT */}
					{nameError && (
						<p className="text-sm text-red-400 p-2 bg-red-900/50 rounded-lg border border-red-700 mb-2">
							{nameError}
						</p>
					)}

					<label htmlFor="tournamentName" className="block text-sm font-medium text-gray-300 mb-1">
						Nom du Tournoi
					</label>
					<input
						type="text"
						id="tournamentName"
						value={name}
						onChange={(e) => {
							setName(e.target.value);
							// Effacer l'erreur dès que l'utilisateur commence à taper
							if (e.target.value.length >= 3) setError('');
						}}
						placeholder="Ex: Thunderdome Cup"
						required
						className={`w-full px-4 py-2 bg-gray-700 border rounded-lg transition duration-150 
                                    ${(name.length > 0 && name.length < 3) ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:ring-blue-500 focus:border-blue-500'}`}
					/>
				</div>

				{/* -------------------- Nombre de Joueurs -------------------- */}
				<div>
					<label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-300 mb-1">
						Nombre de Joueurs (4, 8 ou 16)
					</label>

					<select
						id="maxPlayers"
						value={maxPlayers}
						onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
						required
						className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-white"
					>
						<option value="4">4 joueurs</option>
						<option value="8">8 joueurs</option>
						<option value="16">16 joueurs</option>
					</select>

				</div>

				{/* -------------------- Bouton de Soumission -------------------- */}
				<button
					type="submit"
					disabled={isFormInvalid} // DÉSACTIVATION CONDITIONNELLE
					className={`w-full flex items-center justify-center space-x-2 px-5 py-2 rounded-lg font-bold shadow-lg transition transform 
                                ${isFormInvalid
							? 'bg-gray-600 text-gray-400 cursor-not-allowed' // Style désactivé
							: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white hover:scale-105' // Style activé
						}`}
				>
					<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
					</svg>
					<span>Lancer le Tournoi</span>
				</button>
			</form>
		</div>
	);
}