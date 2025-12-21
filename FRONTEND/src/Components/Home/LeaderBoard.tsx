import { useEffect, useState } from "react";
import api from "../../Utils/axios";
import { useDashboard, type ImageBuffer } from "../../Providers/DashboardProvider";
import Rank from "./Rank";
import type { UserInterface } from "../../Providers/ChatProvider";
import { useSocket } from "../../Providers/SocketProvider";
import { getSetAvatar } from "../../Utils/getter";

export default function LeaderBoard({click, setter} : {click: () => void, setter: (user: UserInterface) => void}) {
	const [leaderBoard, setLeaderBoard] = useState<any>([]);
	const [ avatar, setAvatar ] = useState<ImageBuffer | null>(null);
	const [ whoChanged, setWhoChanged ] = useState<string>("");
	const [rank, setRank] = useState<any>(null);
	const { username } = useDashboard();
	const { socketUser } = useSocket();
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

	useEffect(() => {
		console.log(leaderBoard);
	}, [leaderBoard]);

	useEffect(() => {
		setLeaderBoard(leaderBoard.map((rank) => (rank.username === whoChanged) ? {
			...rank,
			avatar: avatar
		} : rank ));
	}, [avatar, whoChanged]);

	useEffect(() => {
		socketUser?.on("user profil updated", (data) => {
			if (leaderBoard && leaderBoard.some((p: any) => p.username === data.whoChanged)) {
				getSetAvatar(data.whoChanged, setAvatar);
				setWhoChanged(data.whoChanged);
			}
		});
	}, [socketUser, leaderBoard]);

	return (
		<>
			{leaderBoard.length !== 0 ? (
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
										<Rank key={player.username || index} player={player} click={click} setter={setter}/>
									))}
								</tbody>
							</table>
						</div>

						<div className="mt-4 pt-4 border-t-2 border-cyan-500/30">
							<table className="w-full text-left border-collapse">
								<tbody className="text-sm">
									{rank !== null ? (
										<Rank player={rank} click={click} setter={setter} />
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