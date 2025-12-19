import { useNavigate } from "react-router-dom"
import { useAuth } from "../../Providers/AuthProvider";

export default function Play() {
	const { onlineUsers } = useAuth();
	const navigate = useNavigate();
	return (
		<>
			<div className="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-900/40 to-slate-900/40 border border-cyan-500/30 
						backdrop-blur-md p-8 shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all hover:shadow-[0_0_50px_rgba(6,182,212,0.3)] hover:border-cyan-400/50">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					<div>
						<h3 className="text-3xl font-bold text-white mb-2">Quick Match</h3>
						<p className="text-slate-400 mb-6">Find a worthy opponent and climb the ranks.</p>
						<div className="flex items-center gap-2 text-sm text-green-400">
							<span className="relative flex h-3 w-3">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
							</span>
							{onlineUsers.length} players online
						</div>
					</div>
					<button
						onClick={() => navigate("/dashboard/play/online")}
						className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-xl rounded-xl shadow-lg transform 
									transition hover:scale-105 hover:brightness-110 active:scale-95 whitespace-nowrap"
					>
						PLAY NOW
						<svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 inline-block ml-2">
							<path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 
										6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
						</svg>
					</button>
				</div>
			</div>
		</>
	)
}