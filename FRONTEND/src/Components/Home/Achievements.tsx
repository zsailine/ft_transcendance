export interface PlayerStatsInterface {
	total_matches: number,
	total_wins: number,
	total_losses: number,
	xp: number,
	streak: number,
	total_duration: number,
	returned: number,
	max_streak: number,
	maxCombo: number,
	total_xp: number,
	winning: number,
}

const computeAchievements = (achievements: any[]) =>
	achievements.map(a => ({
		...a,
		unlocked: a.current >= a.goal
	}));

export function Achievements({ type, show, viewAchievements, PlayerStats, buttonText }: {
	type: number, show: number, viewAchievements: () => void, PlayerStats: PlayerStatsInterface, buttonText: React.ReactNode
}) {
	const HeaderAchievemnts = [
		{ id: 5, title: "Getting Started", desc: "Play your first match", icon: "🎮", unlocked: false, current: PlayerStats.total_matches, goal: 1 },
		{ id: 7, title: "Rookie No More", desc: "Win 5 matches", icon: "📈", unlocked: false, current: PlayerStats.total_wins, goal: 5 },
		{ id: 29, title: "Wall 1", desc: "Counter the ball 5 times in a match", icon: "🧱", unlocked: false, current: PlayerStats.maxCombo, goal: 5 },
	];
	const allAchievements = [
		{ id: 5, title: "Getting Started", desc: "Play your first match", icon: "🎮", unlocked: false, current: PlayerStats.total_matches, goal: 1 },
		{ id: 16, title: "Novice", desc: "Play 20 matches", icon: "🎮", unlocked: false, current: PlayerStats.total_matches, goal: 20 },
		{ id: 15, title: "Veteran", desc: "Play 50 matches", icon: "🎖️", unlocked: false, current: PlayerStats.total_matches, goal: 50 },
		{ id: 1, title: "First Blood", desc: "Win your first match", icon: "⚔️", unlocked: true, current: PlayerStats.total_wins, goal: 1 },
		{ id: 7, title: "Rookie No More", desc: "Win 5 matches", icon: "📈", unlocked: false, current: PlayerStats.total_wins, goal: 5 },
		{ id: 8, title: "Rookie No More 2", desc: "Win 20 matches", icon: "📈", unlocked: false, current: PlayerStats.total_wins, goal: 20 },
		{ id: 9, title: "Rookie No More 3", desc: "Win 50 matches", icon: "📈", unlocked: false, current: PlayerStats.total_wins, goal: 50 },
		{ id: 2, title: "Unstoppable 1", desc: "Win 3 matches in a row", icon: "🔥", unlocked: true, current: PlayerStats.max_streak, goal: 3 },
		{ id: 3, title: "Unstoppable 2", desc: "Win 5 matches in a row", icon: "🔥", unlocked: true, current: PlayerStats.max_streak, goal: 5 },
		{ id: 4, title: "Unstoppable 3", desc: "Win 20 matches in a row", icon: "🔥", unlocked: true, current: PlayerStats.max_streak, goal: 20 },
		{ id: 6, title: "Perfect Game 1", desc: "Win 1 match without conceding", icon: "🛡️", unlocked: false, current: PlayerStats.winning, goal: 1 },
		{ id: 10, title: "Perfect Game 2", desc: "Win 5 match without conceding", icon: "🛡️", unlocked: false, current: PlayerStats.winning, goal: 5 },
		{ id: 11, title: "Perfect Game 3", desc: "Win 20 match without conceding", icon: "🛡️", unlocked: false, current: PlayerStats.winning, goal: 20 },
		{ id: 20, title: "Endurance 1", desc: "Return the ball 50 times", icon: "🏋️", unlocked: false, current: PlayerStats.returned, goal: 50 },
		{ id: 22, title: "Endurance 2", desc: "Return the ball 100 times", icon: "🏋️", unlocked: false, current: PlayerStats.returned, goal: 100 },
		{ id: 21, title: "Endurance 3", desc: "Return the ball 1000 times", icon: "🏋️", unlocked: false, current: PlayerStats.returned, goal: 1000 },
		{ id: 29, title: "Wall 1", desc: "Counter the ball 5 times in a match", icon: "🧱", unlocked: false, current: PlayerStats.maxCombo, goal: 5 },
		{ id: 27, title: "Wall 2", desc: "Counter the ball 10 times in a match", icon: "🧱", unlocked: false, current: PlayerStats.maxCombo, goal: 10 },
		{ id: 28, title: "Wall 3", desc: "Counter the ball 20 times in a match", icon: "🧱", unlocked: false, current: PlayerStats.maxCombo, goal: 20 },
		{ id: 23, title: "Apprentice", desc: "Earn a total of 20 XP", icon: "⭐", unlocked: false, current: PlayerStats.total_xp, goal: 20 },
		{ id: 24, title: "Expert", desc: "Earn a total of 50 XP", icon: "⭐", unlocked: false, current: PlayerStats.total_xp, goal: 50 },
		{ id: 25, title: "Master", desc: "Earn a total of 100 XP", icon: "⭐", unlocked: false, current: PlayerStats.total_xp, goal: 100 },
	];
	const test = type === 0 ? HeaderAchievemnts : allAchievements;
	const mockAchievements = computeAchievements(test);
	return (
		<div className="flex-1 bg-slate-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
			{show === 1 && (
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-2xl font-bold flex items-center gap-2">
						<span className="text-amber-400">🏆</span> Achievements
					</h3>
					<button
						onClick={viewAchievements}
						className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold cursor-pointer transition-colors"
					>
						{buttonText}
					</button>
				</div>

			)}
			<div className="space-y-4">
				{mockAchievements.map((ach) => {
					const progress = Math.min(100, Math.round((ach.current / ach.goal) * 100));

					return (
						<div key={ach.id} className={`flex flex-col gap-3 p-4 rounded-xl border transition-all
                                    ${ach.unlocked ? 'bg-cyan-900/10 border-cyan-500/20' : 'bg-slate-800/20 border-white/5'}`}>

							<div className="flex items-center gap-4">
								<div className="text-3xl bg-slate-800 p-2 rounded-lg">{ach.icon}</div>
								<div className="flex-1">
									<h4 className={`font-bold ${ach.unlocked ? 'text-white' : 'text-slate-400'}`}>{ach.title}</h4>
									<p className="text-xs text-slate-400">{ach.desc}</p>
								</div>
								{ach.unlocked ? (
									<div className="text-cyan-400 text-[10px] font-bold border border-cyan-500/30 px-2 py-1 rounded">UNLOCKED</div>
								) : (
									<span className="text-xs font-mono text-slate-500">{ach.current ? ach.current : 0}/{ach.goal}</span>
								)}
							</div>

							{!ach.unlocked && (
								<div className="w-full bg-slate-700/30 h-1.5 rounded-full overflow-hidden">
									<div
										className="bg-cyan-500 h-full transition-all duration-500"
										style={{ width: `${progress}%` }}
									/>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}