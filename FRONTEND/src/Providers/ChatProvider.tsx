import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ImageBuffer } from "./DashboardProvider";
import api from "../Utils/axios";
import { useAuth } from "./AuthProvider";

interface ChatProviderProps {
	children: ReactNode;
};

export interface UserInterface {
	id: number,
	username: string | null,
	avatar: ImageBuffer | null,
};

interface MessageInterface {
	id: number,
	created_at: string,
	sender_username: string,
	receiver_username: string,
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
	messages: MessageInterface[],
	setMessages: (messages: MessageInterface[]) => void,
	fetchFriends: () => void,
	fetchMessages: () => void
};

const ChatContext = createContext<ChatInterface | null>(null);

export const ChatProvider = ({children}: ChatProviderProps) => {

	const [ friendsList, setFriendsList ] = useState<UserInterface[]>([]);
	const [ searchValue, setSearchValue ] = useState<string>("");
	const [ selectedUser, setSelectedUser ] = useState<UserInterface | null>(null);
	const [ messages, setMessages ] = useState<MessageInterface[]>([]);
	const { user } = useAuth();

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

	const fetchMessages = async () => {
		try {
			const response = await api.get(`/message/get/${selectedUser?.username}`);
			if (response) {
				setMessages(response.data)
			}
		} catch(error) {
			console.log("Error in fetching messages:", error);
		}
	}
	
	useEffect(() => {
		if (user) {
			setMessages([]);
			setSelectedUser(null);
			fetchFriends();
		}
	}, [user]);

	useEffect(() => {
		if (selectedUser) {
			fetchMessages();
		}
	}, [selectedUser]);

	const value = {
		friendsList, setFriendsList,
		searchValue, setSearchValue,
		selectedUser, setSelectedUser,
		messages, setMessages,
		fetchFriends,
		fetchMessages
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
