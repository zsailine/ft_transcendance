import { useEffect, useState } from "react";
import { useChat, type UserInterface } from "../../Providers/ChatProvider";
import { getImageUrlFromBlob } from "../../Utils/blob";

function FriendsList() {

	const { friendsList, searchValue, setSelectedUser } = useChat();
	const [ filteredFriends, setFilteredFriends ] = useState<UserInterface[]>([]);

	const hoverEffect = "hover:bg-cyan-500/10 transition-colors duration-200";
	
	useEffect(() => {
		if (searchValue !== "") {
			setFilteredFriends(friendsList.filter(friend => friend.username?.
				toLowerCase().includes(searchValue.toLowerCase())));
		} else {
			setFilteredFriends(friendsList);
		}
		console.log("Filtered", filteredFriends);
	}, [searchValue, friendsList]);

	if (friendsList.length === 0 ||
		(filteredFriends.length === 0 && searchValue !== "")) {
		return (
			<p className="text-cyan-200/50 p-3 text-center">No friends to show</p>
		);
	}

	return (
		<div className="flex flex-col h-full overflow-y-auto font-helvetica mb-8">
			<ul className="text-white">
				{filteredFriends.map((friend) =>
					<li key={friend.id}>
						<div	className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer ${hoverEffect}`}
									onClick={() => setSelectedUser(friend)}>

							<div id="friends-avatar" className="w-15 h-15">
								{friend.avatar ?
								<img	alt={friend.username?.at(0)?.toUpperCase()}
											src={getImageUrlFromBlob(friend.avatar.data)?.toString()}
											className="w-full h-full rounded-full object-cover border border-cyan-500/20"
								/> :
								<div className="w-full h-full rounded-full bg-cyan-500/10 text-cyan-300 flex items-center justify-center text-lg font-semibold border border-cyan-500/20">
									{friend.username?.at(0)?.toUpperCase()}
								</div>}
							</div>

							<div id="friends-username" className="text-sm text-white font-medium truncate">
								{friend.username}
							</div>

						</div>
					</li> )}
			</ul>
		</div>
	);
}

export default FriendsList;
