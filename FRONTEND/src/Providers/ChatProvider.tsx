import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ImageBuffer } from "./DashboardProvider";
import api from "../Utils/axios";
import { useAuth } from "./AuthProvider";
import { toast } from "react-toastify";
import { useSocket } from "./SocketProvider";
import { getUserInfo } from "../Utils/getter";

interface ChatProviderProps {
	children: ReactNode;
};

interface MessageDataInterface {
	text: string | null,
	image: ImageBuffer | null
}

export interface UserInterface {
	id: number,
	username: string,
	avatar: ImageBuffer | null,
};

interface MessageInterface {
	id: number,
	created_at: string,
	sender_username: string | null,
	receiver_username: string | null,
	text: string | null,
	image: ImageBuffer | null,
	status: string
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

export const ChatProvider = ({ children }: ChatProviderProps) => {

	const [friendsList, setFriendsList] = useState<UserInterface[]>([]);
	const [searchValue, setSearchValue] = useState<string>("");
	const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
	const [messages, setMessages] = useState<MessageInterface[]>([]);
	const { user, socket, onlineUsers } = useAuth();
	const { socketFriend } = useSocket();

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
			await api.post(`/message/send/${selectedUser?.username}`, messageData);
		} catch (error) {
			toast.error("Something went wrong while sending message");
			console.log(error);
		}
	}

	const readMessage = async (messageId: number) => {
		try {
			await api.put(`/message/${messageId}/read`);
		} catch(error) {
			console.log(error);
		}
	}

	const subscribeMessage = () => {
		if (!selectedUser) return;

		socket?.on("new message", (newMessage) => {
			if ((selectedUser.username === newMessage.receiver_username && user === newMessage.sender_username) ||
				selectedUser.username === newMessage.sender_username && user === newMessage.receiver_username) {
					setMessages((prevMessages) => [...prevMessages, newMessage]);
				}
		})
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
		socket?.on("message read", (data) => {
			if (selectedUser && data.conversation === selectedUser.username) {
				setMessages((curr) => curr.map(m => 
				(m.id <= data.last && m.sender_username === user) ? {...m, status: data.status} : m
				));
			}
		})
		return () => {
			socket?.off("new message");
			socket?.off("message read");
		}
	}, [socket, selectedUser, user, onlineUsers]);

	useEffect(() => {
		socketFriend?.on("request accepted", (friendship) => {
			if (friendship.user_a === user) {
				getUserInfo(friendship.user_b).then(data => {
					setFriendsList((prev) => [...prev, {
						id: data.id,
						avatar: data.avatar,
						username: friendship.user_b
					}]);
				})
			} else if (friendship.user_b === user) {
				getUserInfo(friendship.user_a).then(data => {
					setFriendsList((prev) => [...prev, {
						id: data.id,
						avatar: data.avatar,
						username: friendship.user_a
					}]);
				})
			}
		});

		return () => {
			socketFriend?.off("request accepted");
		}
	}, [socketFriend]);

	useEffect(() => {
		if (selectedUser && messages.length > 0) {
			const lastMessages = messages[messages.length - 1];
			if (lastMessages.sender_username === selectedUser.username && lastMessages.status !== "read") {
				readMessage(lastMessages.id);
			}
		}
	}, [socket, messages])

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
