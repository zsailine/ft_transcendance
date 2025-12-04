import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useChat, type UserInterface } from "./ChatProvider";
import { useAuth } from "./AuthProvider";
import { toast } from "react-toastify";
import api from "../Utils/axios";
import { useSocket } from "./SocketProvider";
import { getUserInfo } from "../Utils/getter";

interface FriendProviderProps {
	children: ReactNode;
};

interface FriendInterface {
	friendRequests: UserInterface[],
	setFriendRequests: (friendRequests: UserInterface[]) => void,
	searchValue: string,
	setSearchValue: (searchValue: string) => void,
	selectedUserProfil: UserInterface | null,
	setSelectedUserProfil: (user: UserInterface | null) => void,
	unknowns: UserInterface[],
	setUnknowns: (unknown: UserInterface[]) => void,
	blockedUsers: UserInterface[],
	setBlockedUsers: (blocked: UserInterface[]) => void,
	blockedUsername: string[],
	setBlockedUsername: (block: string[]) => void,
	acceptInvite: (friend: UserInterface) => void,
	declineInvite: (friend: UserInterface) => void,
	addFriend: (friend: UserInterface) => void,
	unfriend: (friend: UserInterface) => void,
	unblock: (friend: UserInterface) => void,
	fetchNotFriends: () => void
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

	const fetchFriendRequests = async () => {
		try {
			const response = await api.get("friend/request/all");
			if (response) {
				setFriendRequests(response.data);
			}
		} catch(error) {
			console.log("Error in fetching friend requests", error);
			toast.error(`Something went wrong`);
		}
	}

	const fetchNotFriends = async () => {
		try {
			const response = await api.get("/friend/non-friends");
			if (response) {
				setUnknowns(response.data);
			}
		} catch(error) {
			console.log("Error in fetching not friends", error);
			toast.error("Something went wrong");
		}
	}

	const fetchBlockedUsers = async () => {
		try {
			const response = await api.get("/friend/blocked/all");
			if (response) {
				setBlockedUsers(response.data);
			}
		} catch(error) {
			console.log("Error in fetchin blocked users", error);
			toast.error("Something went wrong");
		}
	}

	const acceptInvite = async (friend: UserInterface) => {
		await api.put(`/friend/request/${friend.username}/accept`)
		.then(() => {
			toast("Friend request accepted");
			setFriendsList([...friendsList, friend]);
		})
		.catch(() => {
			toast.error("Something went wrong");
		})
	}

	const declineInvite = async (friend: UserInterface) => {
		await api.put(`/friend/request/${friend.username}/decline`)
		.then(() => {
			toast("Friend request declined");
			const filtered = friendsList.filter((f) => f.username !== friend.username);
			setFriendsList(filtered);
		})
		.catch((err) => {
			console.log(err);
			toast.error("Something went wrong");
		})
	}

	const addFriend = async (friend: UserInterface) => {
		await api.post(`/friend/request/${friend.username}`)
		.then(() => {
			toast("Friend request sent");
			setUnknowns(prev => prev.filter(u => u.username !== friend.username));
		})
		.catch(() => {
			toast.error("Something went wrong");
		})
	}

	const unfriend = async (friend: UserInterface) => {
		await api.put(`/friend/request/${friend.username}/decline`)
		.then(() => {
			toast("Friend request declined");
			const filtered = friendsList.filter((f) => f.username !== friend.username);
			setFriendsList(filtered);
		})
	}

	const unblock = async (friend: UserInterface) => {
		await api.put(`/friend/request/${friend.username}/unblock`)
		.then(() => {
			toast("User unblocked successfully");
			const filtered = blockedUsers.filter((f) => f.username !== friend.username);
			setBlockedUsers(filtered);
		})
	}
	
	useEffect(() => {
		if (user) {
			setSearchValue("");
			fetchFriendRequests();
		}
	}, [user, friendsList]);

	useEffect(() => {
		if (user) {
			fetchNotFriends();
			fetchBlockedUsers();
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

		return () => {
			socketFriend?.off("request sent");
		}
	}, [socketFriend]);

	const value = {
		friendRequests, setFriendRequests,
		searchValue, setSearchValue,
		selectedUserProfil, setSelectedUserProfil,
		unknowns, setUnknowns,
		blockedUsers, setBlockedUsers,
		blockedUsername, setBlockedUsername,
		acceptInvite, declineInvite, addFriend,
		fetchNotFriends, fetchBlockedUsers,
		unfriend, unblock
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
