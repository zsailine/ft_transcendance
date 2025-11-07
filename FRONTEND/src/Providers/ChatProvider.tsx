import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ImageBuffer } from "./DashboardProvider";
import api from "../Utils/axios";

interface ChatProviderProps {
	children: ReactNode;
};

export interface UserInterface {
	id: number,
	username: string | null,
	avatar: ImageBuffer | null,
	text: string | null,
	image: ImageBuffer | null
};

interface ChatInterface {
	friendsList: UserInterface[],
	setFriendsList: (friendsList: UserInterface[]) => void,
	searchValue: string,
	setSearchValue: (searchValue: string) => void,
	selectedUser: UserInterface | null,
	setSelectedUser: (selectedUser: UserInterface | null) => void,
	fetchFriends: () => void
};

const ChatContext = createContext<ChatInterface | null>(null);

export const ChatProvider = ({children}: ChatProviderProps) => {

	const [ friendsList, setFriendsList ] = useState<UserInterface[]>([]);
	const [ searchValue, setSearchValue ] = useState<string>("");
	const [ selectedUser, setSelectedUser ] = useState<UserInterface | null>(null);

	const fetchFriends = async () => {
		try {
			const response = await api.get('/message/contacts');
			if (response) {
				setFriendsList(response.data);
			}
		} catch(error) {
			console.log("Error in fetching friends:", error);
		}
	}
	
	useEffect(() => {
		fetchFriends();
	}, []);


	const value = {
		friendsList,
		setFriendsList,
		searchValue,
		setSearchValue,
		selectedUser,
		setSelectedUser,
		fetchFriends
	};

	return (
		<ChatContext.Provider value={value}>
			{children}
		</ChatContext.Provider>
	);
}

export const useChat = (): ChatInterface => {
	const context = useContext(ChatContext);
	if (!context)
		throw new Error("Error in context");
	return context;
}
