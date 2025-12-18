import { useEffect, useState } from "react";
import { type UserInterface } from "../../Providers/ChatProvider";
import { getImageUrlFromBlob } from "../../Utils/blob";
import { useNavigate } from "react-router-dom";
import { AddFriendButton, MessageFriendButton } from "../../Pages/Chat/ListUtils";
import { NoContacts, NotFound } from "../../Pages/Friend/NoContacts";
import { useAuth } from "../../Providers/AuthProvider";

interface FriendsListProps {
	friendsList: UserInterface[],
	searchValue: string,
	message: string,
	setSelectedUser: (user: UserInterface) => void,
	setSelectedUserProfil: (user: UserInterface) => void,
	click: (() => void) | undefined
}

function FriendsList({ friendsList, searchValue, setSelectedUser, message, setSelectedUserProfil, click }: FriendsListProps) {
	const { onlineUsers } = useAuth();
	const [filteredFriends, setFilteredFriends] = useState<UserInterface[]>([]);
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

	if (friendsList.length === 0 && searchValue === "") {
		return (<NoContacts message={message} />)
	} else if (filteredFriends.length === 0 && searchValue !== "") {
		return (<NotFound />);
	}

	return (
		<div className={`flex flex-col flex-1 overflow-y-auto font-helvetica mb-8 ${message !== "friends" && message !== "research" ? ""
			: "w-full md:w-[50%]"}`}>
			<ul className="text-white">
				{filteredFriends.map((friend) =>
					<li key={friend.id} className={`flex items-center p-2 rounded-lg cursor-pointer ${hoverEffect}`}>
						<div className="flex gap-2 md:gap-5 items-center w-full"
							onClick={() => setSelectedUser(friend)}>

							<div id="friends-avatar" className="relative w-12 h-12 md:w-15 md:h-15">
								<img
									alt={friend.username?.at(0)?.toUpperCase()}
									src={friend.avatar ? getImageUrlFromBlob(friend.avatar)?.toString() : "/images/avatar.jpg"}
									className="w-full h-full rounded-full object-cover border border-cyan-500/20"
								/>
								<span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#101728] ${onlineUsers.includes(friend.username) ? "bg-green-400" : ""} rounded-full border-2 border-gray-600`}></span>
							</div>
							<div id="friends-username" className={`text-sm text-white font-medium truncate ${message !== "message" ? "hover:underline" : ""}`}
								onClick={() => {
									setSelectedUserProfil(friend);
									click?.();
								}}>
								{friend.username}
							</div>
						</div>
						<div>
							{message !== "message" ? (message === "research" ?
								<AddFriendButton friend={friend} /> :
								<MessageFriendButton handleClick={() => handleMessageClick(friend)} />)
								: <></>}
						</div>
					</li>)}
			</ul>
		</div>
	);
}

export default FriendsList;
