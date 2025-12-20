import { motion } from "framer-motion";
import api from "../../Utils/axios";
import { useEffect, useState } from "react";
import { Achievements, type PlayerStatsInterface } from "../Home/Achievements";
import { IoMdClose } from "react-icons/io";
interface ProfilProps {
	username: string;
	quit: () => void
}

export default function OverlayAchievements({ username, quit }: ProfilProps) {
	const defaultStats: PlayerStatsInterface = {
		total_matches: 0,
		total_wins: 0,
		total_losses: 0,
		xp: 0,
		streak: 0,
		total_duration: 0,
		returned: 0,
		max_streak: 0,
		maxCombo: 0,
		total_xp: 0,
		winning: 0,
	};
	const [stats, setStats] = useState<PlayerStatsInterface>(defaultStats);
	async function getStats() {
		const response = await api.get(`/matches/stats/${username}`);
		if (response.data.total_matches)
			setStats(response.data);
	}
	useEffect(() => {
		getStats();
	}, [])

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -30 }}
			transition={{ duration: 1, ease: "easeOut" }}
			className="absolute z-100 h-[80%] w-full flex flex-col items-center justify-center 
               mx-auto max-w-xl px-4 sm:px-6 lg:px-8 border border-amber-100/10 
            rounded-lg shadow-md shadow-amber-100/20 py-6 bg-cyan-800/20
            top-1/2           
        left-1/2
        transform         
        -translate-x-1/2  
        -translate-y-1/2 "
		>
			<div className="w-full overflow-y-auto">
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-2xl font-bold text-white flex items-center gap-2">
						<span className="text-amber-400">🏆</span> Achievements
					</h3>
				</div>
				<Achievements
					type={1}
					show={0}
					buttonText={<>X</>}
					PlayerStats={stats}
					viewAchievements={quit}
				/>
					<div className="absolute top-4 right-4 text-cyan-400 text-3xl cursor-pointer">
						<IoMdClose onClick={quit} />
					</div>
			</div>

		</motion.div>
	);
}