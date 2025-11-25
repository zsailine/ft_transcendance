import { useEffect, useState } from "react";
import { type UserInterface } from "../../Providers/ChatProvider";
import { getImageUrlFromBlob } from "../../Utils/blob";
import { useNavigate } from "react-router-dom";
import { AddFriendButton, MessageFriendButton } from "../../Pages/Chat/ListUtils";
import { NoContacts } from "../../Pages/Friend/NoContacts";

interface FriendsListProps {
	friendsList: UserInterface[],
	searchValue: string,
	message: string,
	setSelectedUser: (user: UserInterface) => void
}

function FriendsList({ friendsList, searchValue, setSelectedUser, message }: FriendsListProps) {
	const [ filteredFriends, setFilteredFriends ] = useState<UserInterface[]>([]);
	const navigate = useNavigate();

	const hoverEffect = "hover:bg-cyan-500/10 transition-colors duration-200";

	const handleMessageClick = (friend: UserInterface) => {
		setSelectedUser(friend);
		navigate("/dashboard/discussion");
	}
	
	useEffect(() => {
		if (searchValue !== "") {
			setFilteredFriends(friendsList.filter(friend => friend.username?.
				toLowerCase().includes(searchValue.toLowerCase())));
		} else {
			setFilteredFriends(friendsList);
		}
	}, [searchValue, friendsList]);

	if (friendsList.length === 0 ||
		(filteredFriends.length === 0 && searchValue !== "")) {
		return (
			<NoContacts message={message}/>
		);
	}

	return (
		<div className="flex flex-col h-full overflow-y-auto font-helvetica mb-8">
			<ul className="text-white">
				{filteredFriends.map((friend) =>
					<li key={friend.id} className={`flex items-center gap-150 p-2 rounded-lg cursor-pointer ${hoverEffect}`}>
						<div className="flex gap-5 items-center w-full"
						onClick={() => setSelectedUser(friend)}>

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
						{message !== "message" ? (message === "research" ? 
							<AddFriendButton friend={friend}/> :
							<MessageFriendButton handleClick={() => handleMessageClick(friend)}/> )
							: <></>}
					</li> )}
			</ul>
		</div>
	);
}

export default FriendsList;
