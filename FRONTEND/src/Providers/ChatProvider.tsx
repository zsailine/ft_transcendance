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
	// text: string | null,
	// image: ImageBuffer | null
};

interface ChatInterface {
	friendsList: any,
	setFriendsList: (friendsList: UserInterface[]) => void,
	searchValue: string,
	setSearchValue: (searchValue: string) => void
	fetchFriends: () => void
};

export const ChatContext = createContext<ChatInterface | null>(null);

export const ChatProvider = ({children}: ChatProviderProps) => {

	const [ friendsList, setFriendsList ] = useState<UserInterface[]>([]);
	const [ searchValue, setSearchValue ] = useState<string>("");
	const [ test, setTest ] = useState<boolean>(true);

	const fetchFriends = async () => {
		try {
			const response = await api.get('/users/all');
			console.log("---------------------")
			console.log(response.data)
			console.log("---------------------")

			if (response) {
				setFriendsList((prev) =>[...prev, response.data]); 
				setTest(false);
			}
		} catch(error) {
			console.log("Error in fetching friends:", error);
		}
	}
	
	useEffect(() => {
		fetchFriends();
		console.log(test);
	}, []);
	
	useEffect(() => {
		console.log("***********************")
		console.log("yo" + friendsList);
		console.log("***********************")
		
	}, [friendsList])

	const value = {
		friendsList,
		setFriendsList,
		searchValue,
		setSearchValue,
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
