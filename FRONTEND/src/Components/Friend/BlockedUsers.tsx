import { UnblockButton } from "../../Pages/Chat/ListUtils";
import { NoBlockedUser } from "../../Pages/Friend/NoFriendRequests";
import { useFriend } from "../../Providers/FriendProvider"
import { getImageUrlFromBlob } from "../../Utils/blob";

function BlockedUsers() {
	const { blockedUsers } = useFriend();

	const hoverEffect = "hover:bg-cyan-500/10 transition-colors duration-200";

	if (blockedUsers.length === 0) {
		return (<NoBlockedUser/>);
	}

	return (
	<div className="flex flex-col h-full overflow-y-auto font-helvetica mb-8 w-full gap-10 items-center">
		<ul className="text-white w-full md:w-[50%]">
			{blockedUsers.map((friend) =>
				<li key={friend.id} className={`flex items-center p-2 rounded-lg cursor-pointer ${hoverEffect}`}>
					<div className="flex gap-2 md:gap-5 items-center w-full">

						<div className="w-12 h-12 md:w-15 md:h-15">
							<img	alt={friend.username?.at(0)?.toUpperCase()}
										src={friend.avatar ? getImageUrlFromBlob(friend.avatar)?.toString() : "/images/avatar.jpg"}
										className="w-full h-full rounded-full object-cover border border-cyan-500/20"
							/>
						</div>

						<div className="text-sm text-white font-medium truncate">
							{friend.username}
						</div>
					</div>

					<div>
						<UnblockButton user={friend}/>
					</div>

				</li> )}
		</ul>
	</div>
  )
}

export default BlockedUsers
