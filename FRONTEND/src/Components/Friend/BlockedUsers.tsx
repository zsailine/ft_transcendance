import { useEffect, useState } from "react";
import { UnblockButton } from "../../Pages/Chat/ListUtils";
import { NoBlockedUser } from "../../Pages/Friend/NoFriendRequests";
import { useFriend } from "../../Providers/FriendProvider"
import { getImageUrlFromBlob } from "../../Utils/blob";
import type { ImageBuffer } from "../../Providers/DashboardProvider";
import { useSocket } from "../../Providers/SocketProvider";
import { getSetAvatar } from "../../Utils/getter";

function BlockedUsers() {
	const [ avatar, setAvatar ] = useState<ImageBuffer | null>(null);
	const [ whoChanged, setWhoChanged ] = useState<string>("");
	const { blockedUsers, setBlockedUsers } = useFriend();
	const { socketUser } = useSocket();

	const hoverEffect = "hover:bg-cyan-500/10 transition-colors duration-200";

	useEffect(() => {
		setBlockedUsers(blockedUsers.map((friend) => 
			(friend.username === whoChanged) ? {
				id: friend.id,
				avatar: avatar,
				username: friend.username
			} : friend ));
	}, [avatar, whoChanged]);

	useEffect(() => {
		socketUser?.on("user profil updated", (data) => {
			if (blockedUsers.some(f => f.username === data.whoChanged)) {
				getSetAvatar(data.whoChanged, setAvatar);
				setWhoChanged(data.whoChanged);
			}
		});
	}, [socketUser, blockedUsers]);

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
