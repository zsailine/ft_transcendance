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
	sender_username: string | null,
	receiver_username: string | null,
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
	sendMessages: (message: MessageDataInterface) => void,
	subscribeMessage: () => void,
	unsubscribeMessage: () => void
};

const ChatContext = createContext<ChatInterface | null>(null);

export const ChatProvider = ({ children }: ChatProviderProps) => {

	const [friendsList, setFriendsList] = useState<UserInterface[]>([]);
	const [searchValue, setSearchValue] = useState<string>("");
	const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
	const [messages, setMessages] = useState<MessageInterface[]>([]);
	const { user, socket } = useAuth();

	const fetchFriends = async () => {
		try {
			const response = await api.get('/friend/all');
			if (response) {
				setFriendsList(response.data);
			}
		} catch (error) {
			console.log("Error in fetching friends:", error);
		}
	}

	const fetchMessages = async () => {
		try {
			const response = await api.get(`/message/get/${selectedUser?.username}`);
			if (response) {
				setMessages(response.data);
			}
		} catch (error) {
			console.log("Error in fetching messages:", error);
		}
	}

	const sendMessages = async (messageData: MessageDataInterface) => {
		try {
			const response = await api.post(`/message/send/${selectedUser?.username}`, messageData);
			setMessages(messages.concat(response.data));
		} catch (error) {
			toast.error("Something went wrong while sending message");
			console.log(error);
		}
	}

	const subscribeMessage = () => {
		if (!selectedUser) return;

		socket?.on("new message", (newMessage) => {
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		})
	}

	const unsubscribeMessage = () => {
		socket?.off("new message");
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

	useEffect(() => {
		subscribeMessage();
		return () => unsubscribeMessage();
	}, [socket, selectedUser]);

	const value = {
		friendsList, setFriendsList,
		searchValue, setSearchValue,
		selectedUser, setSelectedUser,
		messages, setMessages,
		fetchFriends,
		fetchMessages,
		sendMessages,
		subscribeMessage, unsubscribeMessage
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
