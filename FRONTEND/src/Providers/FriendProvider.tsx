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
	unknowns: UserInterface[],
	setUnknowns: (unknown: UserInterface[]) => void,
	acceptInvite: (friend: UserInterface) => void,
	declineInvite: (friend: UserInterface) => void,
	addFriend: (friend: UserInterface) => void
};

const FriendContext = createContext<FriendInterface | null>(null);

export const FriendProvider = ({children}: FriendProviderProps) => {

	const [ friendRequests, setFriendRequests ] = useState<UserInterface[]>([]);
	const [ searchValue, setSearchValue ] = useState<string>("");
	const [ unknowns, setUnknowns ] = useState<UserInterface[]>([]);
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
		.catch(() => {
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
	
	useEffect(() => {
		if (user) {
			setSearchValue("");
			fetchFriendRequests();
		}
	}, [user, friendsList]);

	useEffect(() => {
		if (user) {
			fetchNotFriends();
		}
	}, []);

	const value = {
		friendRequests, setFriendRequests,
		searchValue, setSearchValue,
		unknowns, setUnknowns,
		acceptInvite, declineInvite, addFriend
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
