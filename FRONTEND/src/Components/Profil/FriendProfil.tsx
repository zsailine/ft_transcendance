import { useEffect, useState } from "react"
import type { ImageBuffer } from "../../Providers/DashboardProvider"
import { getBanner, getStat, type statInterface } from "../../Utils/getter";
import { useChat, type UserInterface } from "../../Providers/ChatProvider";
import { getImageUrlFromBlob } from "../../Utils/blob";
import { toast } from "react-toastify";
import { BlockButton, UnfriendButton } from "../../Pages/Chat/ListUtils";
import { handleBlocked, handleUnfriend } from "../Utils/ProfilUtils";

interface FriendProfilProps {
	click: () => void,
	user: UserInterface,
	type: string
}

function FriendProfil({click, user, type}: FriendProfilProps) {
	const { setSelectedUser } = useChat();
	const [ banner, setBanner ] = useState<ImageBuffer | null>(null);
	const [ stat, setStat ] = useState<statInterface>({total_losses: 0, total_matches: 0, total_wins:0});

	useEffect(() => {
		try {
			getStat(user.username, setStat);
			getBanner(user.username, setBanner);
		} catch(error) {
			toast.error("Something went wrong");
		}
	}, [user]);

	return (
	<div className="fixed inset-0 bg-black/10 backdrop-blur-md z-[100] flex items-center justify-center transition-opacity duration-300"
		onClick={click}>
		<div className="bg-gray-700 rounded-2xl shadow-2xl w-[30%] h-[60%] m-4 transform scale-100 transition-transform duration-300 text-gray-200 p-4 flex items-center flex-col"
			onClick={(e: React.MouseEvent) => e.stopPropagation()}>

			<div className="relative h-24 sm:h-42 bg-gray-900 rounded-xl overflow-hidden w-full">
				<img alt="banner"
						src={getImageUrlFromBlob(banner?.data)?.toString() || undefined}
						className="w-full h-full object-cover"/>
			</div>

			<div className="px-6 pb-6 self-start">
				<div className="relative -mt-12 mb-4 flex items-end">
					<img alt="avatar"
							src={getImageUrlFromBlob(user.avatar?.data)?.toString() || undefined}
							className="w-32 h-32 rounded-full border-[6px] border-gray-700 object-cover shadow-lg"/>
					<div className="flex flex-col gap-3">
						<span className="relative -mt-12 mb-10 ml-4 flex items-end font-helvetica text-lg">{user.username}</span>
						<span className="relative -mt-12 mb-2 ml-4 flex items-end font-helvetica text-sm text-gray-500 italic">Online</span>
					</div>
				</div>
			</div>

			<div className="bg-gray-800 p-4 rounded-xl shadow-inner w-[70%]">
				<div className="grid grid-cols-3 gap-2 text-center">
					<div>
						<p className="text-sm font-semibold text-gray-400">Wins</p>
						<span className="text-2xl font-extrabold text-white">{stat.total_wins}</span>
					</div>
					<div>
						<p className="text-sm font-semibold text-gray-400">Losses</p>
						<span className="text-2xl font-extrabold text-white">{stat.total_losses}</span>
					</div>
					<div>
						<p className="text-sm font-semibold text-gray-400">Total</p>
						<span className="text-2xl font-extrabold text-white">{stat.total_matches}</span>
					</div>
				</div>
			</div>

			<div className="flex gap-5 w-[80%] flex-shrink-0 mt-10">
				<UnfriendButton
					friend={user}
					setSelectedUser={setSelectedUser}
					type={type}/>
				<BlockButton 
					user={user}
					handleBlocked={handleBlocked}
					type={type}/>
			</div>

			<button className="mt-8 w-[40%] py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition duration-150 shadow-lg flex-shrink-0" 
				onClick={click}>
				Close
			</button>

		</div>
	</div>
	)
}

export default FriendProfil