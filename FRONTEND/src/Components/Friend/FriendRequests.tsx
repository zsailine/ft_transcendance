import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { useFriend } from "../../Providers/FriendProvider";
import { getImageUrlFromBlob } from "../../Utils/blob";
import NoFriendRequests from "../../Pages/Friend/NoFriendRequests";

function FriendRequests() {
	const { friendRequests, acceptInvite, declineInvite } = useFriend();

	const hoverEffect = "hover:bg-cyan-500/10 transition-colors duration-200";
	const acceptButton = "bg-green-500/20 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out shadow-md";
	const declineButton = "bg-red-500/20 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out shadow-md";

	if (friendRequests.length === 0) {
		return (
			<NoFriendRequests />
		);
	}

	return (
	<div className="flex flex-col h-full overflow-y-auto font-helvetica mb-8 w-full">
		<ul className="text-white">
			{friendRequests.map((friend) =>
				<li key={friend.id} className={`flex items-center gap-50 p-2 rounded-lg cursor-pointer ${hoverEffect}`}>
					<div className="flex gap-5 items-center w-full">
						<div id="friends-avatar" className="w-15 h-15">
							{friend.avatar ?
							<img	alt={friend.username?.at(0)?.toUpperCase()}
										src={getImageUrlFromBlob(friend.avatar)?.toString()}
										className="w-full h-full rounded-full object-cover border border-cyan-500/20"
							/> :
							<div className="font-helvetica w-full h-full rounded-full bg-cyan-500/10 text-cyan-300 flex items-center justify-center text-lg font-semibold border border-cyan-500/20">
								{friend.username?.at(0)?.toUpperCase()}
							</div>}
						</div>

						<div id="friends-username" className="text-sm text-white font-medium truncate">
							{friend.username}
						</div>
					</div>
					<div id="button" className="flex gap-20">
						<div id="accept" className={`flex items-center gap-2 text-sm ${acceptButton}`}
							onClick={() => acceptInvite(friend)}>
							<div>Accept</div>
							<IoMdCheckmark />
						</div>
						<div id="decline" className={`flex items-center gap-2 text-sm ${declineButton}`}
							onClick={() => declineInvite(friend)}>
							<div>Decline</div>
							<IoMdClose />
						</div>
					</div>
				</li> )}
		</ul>
	</div>
  )
}

export default FriendRequests
