import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ImageBuffer } from "./DashboardProvider";
import api from "../Utils/axios";
import { useAuth } from "./AuthProvider";
import { toast } from "react-toastify";

interface ChatProviderProps {
	children: ReactNode;
};

interface MessageDataInterface {
	text: string | null,
	image: ImageBuffer | null
}

export interface UserInterface {
	id: number,
	username: string | null,
	avatar: ImageBuffer | null,
};

interface MessageInterface {
	id: number,
	created_at: string,
	sender_username: string | null | undefined,
	receiver_username: string | null | undefined ,
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
	fetchMessages: () => void,
	sendMessages: (message: MessageDataInterface) => void
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
				setMessages(response.data);
			}
		} catch(error) {
			console.log("Error in fetching messages:", error);
		}
	}

	const sendMessages = async (messageData: MessageDataInterface) => {
		const optimisticMessage = {
			id: Math.floor(Date.now() / 1000),
			receiver_username: selectedUser?.username,
			sender_username: user,
			text: messageData.text,
			image: messageData.image,
			created_at: new Date().toISOString()
		};
		setMessages([...messages, optimisticMessage]);

		try {
			const response = await api.post(`/message/send/${selectedUser?.username}`, messageData);
			setMessages(messages.concat(response.data));
		} catch(error) {
			setMessages(messages);
			toast.error("Something went wrong while sending message");
			console.log(error);
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
		fetchMessages,
		sendMessages
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
