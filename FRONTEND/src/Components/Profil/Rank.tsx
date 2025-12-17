interface rankInterface {
    username: string;
    xp: number;
    total_wins: number;
    display_rank: number;
}
export default function Rank({players, username}: {players: rankInterface[] | null, username: string | null}) {
	return (
		<div className="bg-slate-900 rounded-lg overflow-hidden border border-cyan-500/30">
			{players?.map((player) => (
				<div
					key={player.username}
					className={`flex justify-between p-3 ${player.username === username
							? "bg-cyan-500/20 border-l-4 border-cyan-500"
							: "opacity-70"
						}`}
				>
					<div className="flex gap-4">
						<span className="font-bold text-cyan-400">#{player.display_rank}</span>
						<span>{player.username}</span>
					</div>
					<span className="text-amber-400">{player.xp} XP</span>
				</div>
			))}
		</div>
	)
}