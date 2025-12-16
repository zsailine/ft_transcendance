import { useState, createContext, useContext, useEffect, useRef } from "react";
import api from "../Utils/axios";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

interface AuthInterface {
	user: string | null,
	login: (username: string, password: string, totpCode?:string) => any,
	register: (username: string, password: string, email: string) => any,
	logout: () => void,
	setUser: (username: string | null) => void,
	setLoading: (loading: boolean) => void,
	loading: boolean,
	isAuthenticated: boolean,
	socket: Socket | null,
	onlineUsers: string[],
	connectSocket: () => void,
	disconnectSocket: () => void
}

const AuthContext = createContext<AuthInterface | null>(null);

const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context)
		throw new Error("Error in context");
	return context
}

const AuthProvider = ({ children }: any) => {
	const [user, setUser] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [socket, setSocket] = useState<Socket | null>(null);
	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
	const lastJoinUser = useRef<string | null>(null);

	useEffect(() => {
		if (user) {
			connectSocket()
		} else if (!user && socket?.connected) {
			disconnectSocket();
		}
		const interval = setInterval(() => {
			lastJoinUser.current = null;
		}, 10_000);
		return (() => {
			clearInterval(interval);
		})
	}, []);

	useEffect(() => {
		if (user) {
			connectSocket()
		} else if (!user && socket?.connected) {
			disconnectSocket();
		}
	}, [user]);

	const login = async (username: string, password: string, totpCode?: string) => {
		try {
			const postData = {
				username: username,
				password: password,
				totpCode: totpCode
			}

			const { data } = await api.post("/auth/login", postData);

			if (data.requires2FA) {
				return { success: false, requires2FA: true };
			}

			if (!data.username) {
				throw new Error("User not found!");
			}

			setUser(data.username);
			return { success: true, requires2FA: false };
		}
		catch (err: any) {
			if (err.response?.data?.requires2FA) {
				return { success: false, requires2FA: true };
			}

			if (err.response?.data?.error === "Invalid 2FA code") {
				toast.error("Invalid 2FA code!");
				return { success: false, requires2FA: true };
			}

			toast.error(err.response?.data?.error || "User not found!");
			return { success: false, error: err.message, requires2FA: false };
		}
	}

	const register = async (username: string, password: string, email: string) => {
		try {
			const postData = {
				username: username,
				password: password,
				email: email
			}
			await api.post("/users/register", postData)
			return ({ success: true })
		}
		catch (err: any) {
			return ({ success: false, error: err.message })
		}
	}

	const logout = async () => {
		try {
			await api.post("/auth/logout");
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			setUser(null);
		}
	}


	const connectSocket = () => {
		if (!user || socket?.connected) {
			return;
		}

		const newSocket = io("http://localhost:3000", {
			withCredentials: true,
			path: "/message/socket.io",
			transports: ["websocket"],
		})
		newSocket.on("connect", () => { });
		newSocket.on("onlineUser", (usernames: string[]) => {
			setOnlineUsers(usernames);
		});
		newSocket.on("join", (data: any) => {
			if (lastJoinUser.current === data.user) return;
			lastJoinUser.current = data.user;
			toast.success(`${data.user} invited you to play`);
		});
		setSocket(newSocket);
	};

	const disconnectSocket = () => {
		if (socket?.connected) {
			socket.disconnect();
		}
	}

	const value = {
		user,
		login,
		logout,
		register,
		setUser,
		setLoading,
		loading,
		isAuthenticated: !!user,
		connectSocket, disconnectSocket,
		socket, onlineUsers
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>

	)
}

export { useAuth, AuthProvider }