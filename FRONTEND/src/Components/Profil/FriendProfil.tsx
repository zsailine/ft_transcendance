import { useEffect, useState } from "react"
import type { ImageBuffer } from "../../Providers/DashboardProvider"
import { getBanner, getStat, type statInterface } from "../../Utils/getter";
import { useChat, type UserInterface } from "../../Providers/ChatProvider";
import { getImageUrlFromBlob } from "../../Utils/blob";
import { toast } from "react-toastify";
import { BlockButton, UnfriendButton } from "../../Pages/Chat/ListUtils";
import { handleBlocked } from "../Utils/ProfilUtils";
import { useAuth } from "../../Providers/AuthProvider";
import { useNavigate } from "react-router-dom";

interface FriendProfilProps {
	click: () => void,
	user: UserInterface,
	type: string
}

function FriendProfil({click, user, type}: FriendProfilProps) {
	const { onlineUsers } = useAuth();
	const navigate = useNavigate();
	const { setSelectedUser } = useChat();
	const [ banner, setBanner ] = useState<ImageBuffer | null>(null);
	const [ stat, setStat ] = useState<statInterface>({total_losses: 0, total_matches: 0, total_wins:0});

	const handleFullViewProfil = () => {
		navigate(`/dashboard?username=${user.username}`);
	}

	useEffect(() => {
		try {
			getStat(user.username, setStat);
			getBanner(user.username, setBanner);
		} catch(error) {
			toast.error("Something went wrong");
		}
	}, [user]);

	return (
	<div className="fixed inset-0 bg-black/10 backdrop-blur-md z-[100] flex items-center justify-center transition-opacity duration-300 overflow-y-auto font-helvetica"
		onClick={click}>
		<div className="bg-gray-700 overflow-y-auto overflow-hidden rounded-2xl shadow-2xl w-[90%] md:w-[70%] lg:w-[40%] h-auto max-h-[90vh] min-h-[600px] m-4 transform scale-100 transition-transform duration-300 text-gray-200 p-4 flex items-center flex-col"
			onClick={(e: React.MouseEvent) => e.stopPropagation()}>

			<div className="relative h-[20vh] min-h-[120px] max-h-[200px] bg-gray-900 rounded-xl w-full">
				<img alt="banner"
						src={getImageUrlFromBlob(banner?.data)?.toString() || "/images/cover.jpg"}
						className="w-full h-full object-cover"/>
			</div>

			<div className="px-6 pb-6 self-start">
				<div className="relative -mt-12 mb-4 flex items-end">
					<div className="relative">
						<img
							alt="avatar"
							src={getImageUrlFromBlob(user.avatar?.data)?.toString() || "/images/avatar.jpg"}
							className="w-32 h-32 rounded-full border-[6px] border-gray-700 object-cover shadow-lg"/>
						<span className={`absolute bottom-1 right-1 w-4 h-4 ${onlineUsers.includes(user.username) ? "bg-green-400" : ""} rounded-full border-2 border-gray-600`}></span>
					</div>
					<div className="flex flex-col gap-1 ml-6 sm:ml-10">
						<span className="font-helvetica text-lg">{user.username}</span>
						<span className="font-helvetica text-sm text-gray-500 italic">
							{onlineUsers.includes(user.username) ? "Online" : "Offline"}
						</span>
					</div>
				</div>
			</div>

			<div className="bg-gray-800 p-4 rounded-xl shadow-inner w-full sm:w-[90%]">
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

			<div className="flex gap-5 w-[80%] xl:w-[50%] flex-shrink-0 mt-10">
				<UnfriendButton
					friend={user}
					setSelectedUser={setSelectedUser}
					type={type}/>
				<BlockButton 
					user={user}
					handleBlocked={handleBlocked}
					type={type}/>
			</div>

			<div className="flex gap-5 w-[80%] xl:w-[50%] flex-shrink-0 justify-center text-sm">
				<button className="flex-1 mt-8 w-[50%] py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-indigo-600 transition duration-150 shadow-lg flex-shrink-0"
					onClick={handleFullViewProfil}>
					See Profil
				</button>
				<button className="flex-1 mt-8 w-[50%] py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition duration-150 shadow-lg flex-shrink-0" 
					onClick={click}>
					Close
				</button>
			</div>

		</div>
	</div>
	)
}

export default FriendProfil