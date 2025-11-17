import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { UserInterface } from "./ChatProvider";
import { useAuth } from "./AuthProvider";
import { toast } from "react-toastify";
import api from "../Utils/axios";

interface FriendProviderProps {
	children: ReactNode;
};

// interface UserFriendInterface {
// 	od
// }

interface FriendInterface {
	// friendsList
	friendRequests: UserInterface[],
	setFriendRequests: (friendRequests: UserInterface[]) => void,
	selectedUser: UserInterface | null,
	setSelectedUser: (user: UserInterface | null) => void,
	searchValue: string,
	setSearchValue: (searchValue: string) => void
};

const FriendContext = createContext<FriendInterface | null>(null);

export const FriendProvider = ({children}: FriendProviderProps) => {

	const [ friendRequests, setFriendRequests ] = useState<UserInterface[]>([]);
	const [ searchValue, setSearchValue ] = useState<string>("");
	const [ selectedUser, setSelectedUser ] = useState<UserInterface | null>(null);
	const { user } = useAuth();

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
	
	useEffect(() => {
		if (user) {
			setSearchValue("");
			setSelectedUser(null);
			fetchFriendRequests();
		}
	}, [user]);

	const value = {
		friendRequests, setFriendRequests,
		searchValue, setSearchValue,
		selectedUser, setSelectedUser
	};

	return (
		<FriendContext.Provider value={value}>
			{children}
		</FriendContext.Provider>
	);
}

export const useFriend = () => {
	const context = useContext(FriendContext);
	if (!context)
		throw new Error("Error in context");
	return context;
}
