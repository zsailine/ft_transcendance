import { useEffect } from "react";
import { useChat, type UserInterface } from "../../Providers/ChatProvider";

function FriendsList() {
	const { friendsList, searchValue } = useChat();
	
	let filteredFriends: UserInterface[] = [];

	useEffect(() => {
		if (searchValue !== "") {
			filteredFriends = friendsList.filter(friend => friend.username?.
				toLowerCase().includes(searchValue.toLowerCase()));
		} else {
			console.log(friendsList);
			filteredFriends = friendsList;
		}
	}, []);

	if (friendsList.length === 0 ||
		(filteredFriends.length === 0 && searchValue !== "")) {
		return (
			<p className="text-cyan-200/50 p-3 text-center">No friends to show</p>
		);
	}

	return (
		<div className="flex flex-col h-full overflow-y-auto font-helvetica">
			<ul>
				{filteredFriends.map(friend => (friend.avatar === null ? <li>No avatar</li> : <li>SomeAvatar</li>) )}
			</ul>
		</div>
	);
}

export default FriendsList;
