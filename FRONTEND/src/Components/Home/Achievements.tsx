const mockAchievements = [
	{ id: 5, title: "Getting Started", desc: "Play your first match", icon: "🎮", unlocked: false },
	{ id: 7, title: "Rookie No More", desc: "Win 5 matches", icon: "📈", unlocked: false },
	{ id: 2, title: "Unstoppable 1", desc: "Win 3 matches in a row", icon: "🔥", unlocked: true },
];

const allAchievements = [
	{ id: 5, title: "Getting Started", desc: "Play your first match", icon: "🎮", unlocked: false },
	{ id: 16, title: "Novice", desc: "Play 20 matches", icon: "🎮", unlocked: false },
	{ id: 15, title: "Veteran", desc: "Play 50 matches", icon: "🎖️", unlocked: false },
	{ id: 1, title: "First Blood", desc: "Win your first match", icon: "⚔️", unlocked: true },
	{ id: 7, title: "Rookie No More", desc: "Win 5 matches", icon: "📈", unlocked: false },
	{ id: 8, title: "Rookie No More 2", desc: "Win 20 matches", icon: "📈", unlocked: false },
	{ id: 9, title: "Rookie No More 3", desc: "Win 50 matches", icon: "📈", unlocked: false },
	{ id: 2, title: "Unstoppable 1", desc: "Win 3 matches in a row", icon: "🔥", unlocked: true },
	{ id: 3, title: "Unstoppable 2", desc: "Win 5 matches in a row", icon: "🔥", unlocked: true },
	{ id: 4, title: "Unstoppable 3", desc: "Win 20 matches in a row", icon: "🔥", unlocked: true },
	{ id: 6, title: "Perfect Game", desc: "Win a match without conceding a point", icon: "🛡️", unlocked: false },
	{ id: 17, title: "Early Finish", desc: "Win a match in under 2 minutes", icon: "⏳", unlocked: false },
	{ id: 20, title: "Endurance 1", desc: "Return the ball 20 times in a single match", icon: "🏋️", unlocked: false },
	{ id: 22, title: "Endurance 2", desc: "Return the ball 50 times in a single match", icon: "🏋️", unlocked: false },
	{ id: 21, title: "Endurance 3", desc: "Return the ball 100 times in a single match", icon: "🏋️", unlocked: false },
];

export default function Achievements({viewAchievements} : {viewAchievements: () => void}) {
	return (
		<>
			<div className="flex-1 bg-slate-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-2xl font-bold flex items-center gap-2">
						<span className="text-amber-400">🏆</span> Achievements
					</h3>
					<button
						onClick={viewAchievements}
						className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold cursor-pointer transition-colors"
					>
						View All &rarr;
					</button>
				</div>

				<div className="space-y-4">
					{mockAchievements.map((ach) => (
						<div key={ach.id} className={`flex items-center gap-4 p-4 rounded-xl border 
									${ach.unlocked ? 'bg-cyan-900/10 border-cyan-500/20' : 'bg-slate-800/20 border-white/5 opacity-60'}`}>
							<div className="text-3xl bg-slate-800 p-2 rounded-lg">{ach.icon}</div>
							<div>
								<h4 className={`font-bold ${ach.unlocked ? 'text-white' : 'text-slate-400'}`}>{ach.title}</h4>
								<p className="text-xs text-slate-400">{ach.desc}</p>
							</div>
							{ach.unlocked && <div className="ml-auto text-cyan-400 text-xs font-bold border border-cyan-500/30 px-2 py-1 rounded">UNLOCKED</div>}
						</div>
					))}
				</div>
			</div>
		</>
	)
}