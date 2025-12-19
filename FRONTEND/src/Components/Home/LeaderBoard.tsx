import { useEffect, useState } from "react";
import api from "../../Utils/axios";
import { useDashboard } from "../../Providers/DashboardProvider";
import Rank from "./Rank";

export default function LeaderBoard() {
	const [leaderBoard, setLeaderBoard] = useState<any>(null);
	const [rank, setRank] = useState<any>(null);
	const { username } = useDashboard();
	async function getLeaderBoard() {
		const response = await api.get(`/matches/leaderboard`);
		if (response.data)
			setLeaderBoard(response.data);
	}
	async function getRank() {
		const response = await api.get(`/matches/rank/${username}`);
		if (response.data)
			setRank(response.data);
	}
	useEffect(() => {
		if (!username) return
		try {
			getLeaderBoard();
			getRank();
		}
		catch { }
	}, [username]);
	return (
		<>
			{leaderBoard !== null ? (
				<div className="lg:col-span-5 h-full">
					<div className="bg-[#0b101e]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md h-full flex flex-col shadow-xl">
						<h3 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">
							Global Leaderboard
						</h3>
						<div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="text-slate-400 text-sm uppercase tracking-wider border-b border-white/5">
										<th className="pb-3 pl-2 w-12">Rank</th>
										<th className="pb-3">Player</th>
										<th className="pb-3 text-right pr-2">XP</th>
									</tr>
								</thead>
								<tbody className="text-sm">
									{leaderBoard.map((player: any, index: number) => (
										<Rank key={player.username || index} player={player} />
									))}
								</tbody>
							</table>
						</div>

						<div className="mt-4 pt-4 border-t-2 border-cyan-500/30">
							<table className="w-full text-left border-collapse">
								<tbody className="text-sm">
									{rank !== null ? (
										<Rank player={rank} />
									) : (
										<tr>
											<td colSpan={3} className="py-4 text-center text-slate-500 italic">
												Loading your rank...
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			) : (
				<h1 className="text-xl text-white">Loading LeaderBoard...</h1>
			)}
		</>
	)
}