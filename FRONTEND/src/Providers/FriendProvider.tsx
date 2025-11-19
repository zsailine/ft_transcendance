import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useChat, type UserInterface } from "./ChatProvider";
import { useAuth } from "./AuthProvider";
import { toast } from "react-toastify";
import api from "../Utils/axios";

interface FriendProviderProps {
	children: ReactNode;
};

interface FriendInterface {
	friendRequests: UserInterface[],
	setFriendRequests: (friendRequests: UserInterface[]) => void,
	searchValue: string,
	setSearchValue: (searchValue: string) => void,
	notFriends: (search: string) => Promise<UserInterface[]>,
	acceptInvite: (friend: UserInterface) => void,
	declineInvite: (friend: UserInterface) => void,
	addFriend: (friend: UserInterface) => void
};

const FriendContext = createContext<FriendInterface | null>(null);

export const FriendProvider = ({children}: FriendProviderProps) => {

	const [ friendRequests, setFriendRequests ] = useState<UserInterface[]>([]);
	const [ searchValue, setSearchValue ] = useState<string>("");
	const { user } = useAuth();
	const { friendsList, setFriendsList } = useChat();

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

	const notFriends = async (search: string) : Promise<UserInterface[]> => {
		if (search === "") {
			return [];
		}
		try {
			const response = await api.get("/message/contacts");
			if (response) {
				let filtered : UserInterface[] = [];
				const allFriends: UserInterface[] = response.data;
				allFriends.map((friend: UserInterface) => {
					if (!friendsList.some(user => user.username === friend.username)
						&& friend.username?.includes(search))
					{
						filtered.push({
							id: friend.id,
							username: friend.username,
							avatar: friend.avatar
						});
					}
				});
				return filtered;
			}
			return [];
		} catch(error) {
			console.log("Error in getting search");
			toast.error("Something went wrong");
			return [];
		}
	}

	const acceptInvite = async (friend: UserInterface) => {
		api.put(`/friend/request/${friend.username}/accept`)
		.then(() => {
			toast("Friend request accepted");
			setFriendsList([...friendsList, friend]);
		})
		.catch(() => {
			toast.error("Something went wrong");
		})
	}

	const declineInvite = async (friend: UserInterface) => {
		api.put(`/friend/request/${friend.username}/decline`)
		.then(() => {
			toast("Friend request declined");
			const filtered = friendsList.filter((f) => f.username !== friend.username);
			setFriendsList(filtered);
		})
		.catch(() => {
			toast.error("Something went wrong");
		})
	}

	const addFriend = async (friend: UserInterface) => {
		api.post(`/friend/request/${friend.username}`)
		.then(() => {
			toast("Friend request sent");
			setFriendRequests([...friendRequests, {
				id: friend.id,
				avatar: friend.avatar,
				username: friend.username
			}]);
		})
		.catch(() => {
			toast.error("Something went wrong");
		})
	}
	
	useEffect(() => {
		if (user) {
			setSearchValue("");
			fetchFriendRequests();
		}
	}, [user, friendsList]);

	const value = {
		friendRequests, setFriendRequests,
		searchValue, setSearchValue,
		notFriends, acceptInvite,
		declineInvite, addFriend
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
