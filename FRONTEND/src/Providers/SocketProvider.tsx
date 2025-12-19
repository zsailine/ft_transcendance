import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./AuthProvider";

interface SocketProviderProps {
	children: ReactNode
}

interface SocketInterface {
	socketFriend: Socket | null,
	setSocketFriend: (s: Socket | null) => void
}

const SocketContext = createContext<SocketInterface | null>(null);

export const SocketProvider = ({ children }: SocketProviderProps) => {
	
	const [socketFriend, setSocketFriend] = useState<Socket | null>(null);
	const { user } = useAuth();

	const connectSocket = () => {
		if (!user || socketFriend?.connected) return ;

		const newSocket = io("http://localhost:3000", {
			withCredentials: true,
			path: "/friend/socket.io",
			transports: ["websocket"],
			reconnection: false
		});
		setSocketFriend(newSocket);
	}

	const disconnectSocket = () => {
		if (socketFriend?.connected) {
			socketFriend.disconnect();
		}
	}

	useEffect(() => {
		if (user) {
			connectSocket();
		} else if (!user && socketFriend?.connected) {
			disconnectSocket();
		}
	}, [user]);

	const value = {
		socketFriend, setSocketFriend
	};

	return (
		<SocketContext.Provider value={value}>
			{children}
		</SocketContext.Provider>
	);
}

export const useSocket = (): SocketInterface => {
	const context = useContext(SocketContext);
	if (!context)
		throw new Error("Error in Socket Context");
	return context;
}
