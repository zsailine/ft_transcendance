import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { UserInterface } from "./ChatProvider";
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
	notFriends: (search: string) => UserInterface[]
};

const FriendContext = createContext<FriendInterface | null>(null);

export const FriendProvider = ({children}: FriendProviderProps) => {

	const [ friendRequests, setFriendRequests ] = useState<UserInterface[]>([]);
	const [ searchValue, setSearchValue ] = useState<string>("");
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

	const notFriends = async (search: string) => {
		try {
			const response = await api.get("/users/all");
			if (response) {
				
			}
		} catch(error) {
			console.log("Error in getting search");
			toast.error("Something went wrong");
		}
	}
	
	useEffect(() => {
		if (user) {
			setSearchValue("");
			fetchFriendRequests();
		}
	}, [user]);

	const value = {
		friendRequests, setFriendRequests,
		searchValue, setSearchValue,
		notFriends
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
