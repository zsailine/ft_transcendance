import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useChat, type UserInterface } from "./ChatProvider";
import { useAuth } from "./AuthProvider";
import { useSocket } from "./SocketProvider";
import { getUserInfo } from "../Utils/getter";
import { useFriendAction } from "./Utils/FriendAction";
import type { FriendInterface } from "./Utils/FriendInterface";

interface FriendProviderProps {
	children: ReactNode;
};

const FriendContext = createContext<FriendInterface | null>(null);

export const FriendProvider = ({children}: FriendProviderProps) => {

	const [ friendRequests, setFriendRequests ] = useState<UserInterface[]>([]);
	const [ searchValue, setSearchValue ] = useState<string>("");
	const [ selectedUserProfil, setSelectedUserProfil ] = useState<UserInterface | null>(null);
	const [ unknowns, setUnknowns ] = useState<UserInterface[]>([]);
	const [ blockedUsers, setBlockedUsers ] = useState<UserInterface[]>([]);
	const [ blockedUsername, setBlockedUsername ] = useState<string[]>([]);
	const { user } = useAuth();
	const { friendsList, setFriendsList } = useChat();
	const { socketFriend } = useSocket();

	const friendAction = useFriendAction({
		setFriendRequests: setFriendRequests,
		setUnknowns: setUnknowns,
		setBlockedUsers: setBlockedUsers,
		setFriendsList: setFriendsList,
		blockedUsers: blockedUsers,
		friendsList: friendsList
	});
	
	useEffect(() => {
		if (user) {
			setSearchValue("");
			friendAction.fetchFriendRequests();
		}
	}, [user, friendsList]);

	useEffect(() => {
		if (user) {
			friendAction.fetchNotFriends();
			friendAction.fetchBlockedUsers();
			setSelectedUserProfil(null);
		}
	}, [user]);

	useEffect(() => {
		const b = blockedUsers.map((user) => user.username)
			.filter((user): user is string => user !== null);
		setBlockedUsername(b);
	}, [blockedUsers]);

	useEffect(() => {

		socketFriend?.on("request sent", (friendship) => {
			if (friendship.sender !== user) {
				getUserInfo(friendship.sender).then(data => {
					setFriendRequests((prev) => [...prev, {
						id: data.id,
						avatar: data.avatar,
						username: friendship.sender
					}]);
				});
			}
		});
		
		socketFriend?.on("request declined", (friendship) => {
			if (friendship.user_a === user) {
				const filtered = friendRequests.filter((f) => f.username !== friendship.user_b);
				setFriendRequests(filtered);
				getUserInfo(friendship.user_b).then(data => {
					setUnknowns((prev) => [...prev, {
						id: data.id,
						avatar: data.avatar,
						username: friendship.user_b
					}]);
				});
			} else if (friendship.user_b === user) {
				const filtered = friendRequests.filter((f) => f.username !== friendship.user_a);
				setFriendRequests(filtered);
				getUserInfo(friendship.user_a).then(data => {
					setUnknowns((prev) => [...prev, {
						id: data.id,
						avatar: data.avatar,
						username: friendship.user_a
					}]);
				});
			}
		});

		socketFriend?.on("friend blocked", (friendship) => {
			if (friendship.blocked_by === user) {
				const toAddUser = (user === friendship.user_a) ? friendship.user_b : friendship.user_a;
				getUserInfo(toAddUser).then((data) => {
					setBlockedUsers((prev) => [...prev, {
						id: data.id,
						avatar: data.avatar,
						username: toAddUser
					}]);
				});
			}
		});

		socketFriend?.on("non-friend user blocked", (friendship) => {
			if (friendship.blocked_by === user) {
				const toAddUser = (user === friendship.user_a) ? friendship.user_b : friendship.user_a;
				getUserInfo(toAddUser).then((data) => {
					setBlockedUsers((prev) => [...prev, {
						id: data.id,
						avatar: data.avatar,
						username: toAddUser
					}]);
				});
			}
			if (friendship.user_a === user) {
				setUnknowns(prev => prev.filter(u => u.username !== friendship.user_b));
			} else if (friendship.user_b === user) {
				setUnknowns(prev => prev.filter(u => u.username !== friendship.user_a));
			}
		});

		socketFriend?.on("friend unblocked", (friendship) => {
			if (friendship.blocked_by === user) {
				const toDeleteUser = (user === friendship.user_a) ? friendship.user_b : friendship.user_a;
				const newList = blockedUsers.filter((f) => f.username !== toDeleteUser);
				setBlockedUsers(newList);
			}
		});

		socketFriend?.on("non-friend user unblocked", (friendship) => {
			if (friendship.blocked_by === user) {
				const toDeleteUser = (user === friendship.user_a) ? friendship.user_b : friendship.user_a;
				const newList = blockedUsers.filter((f) => f.username !== toDeleteUser);
				setBlockedUsers(newList);
				getUserInfo(toDeleteUser).then((data) => {
					setUnknowns((prev) => [...prev, {
						id: data.id,
						avatar: data.avatar,
						username: toDeleteUser
					}]);
				});
			}
		});

		return () => {
			socketFriend?.off("request sent");
			socketFriend?.off("request declined");
			socketFriend?.off("friend blocked");
			socketFriend?.off("non-friend user blocked");
			socketFriend?.off("friend unblocked");
			socketFriend?.off("non-friend user unblocked");
		}
	}, [socketFriend]);

	const value = {
		friendRequests, setFriendRequests,
		searchValue, setSearchValue,
		selectedUserProfil, setSelectedUserProfil,
		unknowns, setUnknowns,
		blockedUsers, setBlockedUsers,
		blockedUsername, setBlockedUsername,
		...friendAction
	};

	return (
		<FriendContext.Provider value={value}>
			{children}
		</FriendContext.Provider>
	);
}

export const useFriend = (): FriendInterface => {
	const context = useContext(FriendContext);
	if (!context)
		throw new Error("Error in context");
	return context;
}
