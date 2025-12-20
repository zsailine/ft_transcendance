import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { useFriend } from "../../Providers/FriendProvider";
import { getImageUrlFromBlob } from "../../Utils/blob";
import { NoFriendRequests } from "../../Pages/Friend/NoFriendRequests";

interface FriendRequestsProps {
	click: () => void
}

function FriendRequests({click}: FriendRequestsProps) {
	const { friendRequests, acceptInvite, declineInvite, setSelectedUserProfil } = useFriend();

	const hoverEffect = "hover:bg-cyan-500/10 transition-colors duration-200";
	const acceptButton = "bg-green-500/20 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out shadow-md";
	const declineButton = "bg-red-500/20 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out shadow-md";

	if (friendRequests.length === 0) {
		return (<NoFriendRequests />);
	}

	return (
	<div className="flex flex-col h-full overflow-y-auto font-helvetica mb-8 w-full gap-10 items-center">
		<ul className="text-white w-full md:w-[50%]">
			{friendRequests.map((friend) =>
				<li key={friend.id} className={`flex items-center p-2 rounded-lg cursor-pointer gap-4 ${hoverEffect}`}>
					<div className="flex gap-2 md:gap-4 items-center w-full">
						<div className="w-12 h-12 md:w-15 md:h-15"
							onClick={() => {
								setSelectedUserProfil(friend);
								click?.();
							}}>
							<img	alt={friend.username?.at(0)?.toUpperCase()}
										src={friend.avatar ? getImageUrlFromBlob(friend.avatar)?.toString() : "/images/avatar.jpg"}
										className="w-full h-full rounded-full object-cover border border-cyan-500/20"
							/>
						</div>

						<div className="text-sm text-white font-medium truncate hover:underline"
							onClick={() => {
								setSelectedUserProfil(friend);
								click?.();
							}}>
							{friend.username}
						</div>
					</div>
					<div className="flex gap-5">
						<div id="accept" className={`flex items-center gap-2 text-sm ${acceptButton}`}
							onClick={() => acceptInvite(friend)}>
							<div className="hidden md:block">Accept</div>
							<IoMdCheckmark />
						</div>
						<div id="decline" className={`flex items-center gap-2 text-sm ${declineButton}`}
							onClick={() => declineInvite(friend)}>
							<div className="hidden md:block">Decline</div>
							<IoMdClose />
						</div>
					</div>
				</li> )}
		</ul>
	</div>
  )
}

export default FriendRequests
