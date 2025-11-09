import { useState , createContext, useContext, useEffect} from "react";
import api from "../Utils/axios";
import { io, Socket } from "socket.io-client";

interface AuthInterface {
		token : string | null,
		user : string | null,
		login : (username:string, password:string) => any,
		register : (username:string, password:string, email:string) => any, 
		logout : () => void,
		loading : boolean,
		isAuthenticated : boolean,
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

const AuthProvider = ({children} : any) =>
{
		const [user, setUser] = useState<string | null>(null)
		const [loading, setLoading] = useState<boolean>(true)
		const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
		const [socket, setSocket] = useState<Socket | null>(null);
		const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

		const verifyToken = async () =>
		{
				try
				{
						const {data} = await api.get("/auth/me")
						if (data)
							setUser(data.user)
						else
							logout()
				}
				catch(e)
				{
						console.log(e)
						logout()
				}
				finally
				{
						setLoading(false)
				}
		}

		useEffect(() => {
			if (token)
					verifyToken()
			else
					setLoading(false)
		}, []);

		useEffect(() => {
			if (user && token) {
				connectSocket()
			} else if (!user && socket?.connected) {
				disconnectSocket();
			}
		}, [user, token]);

		const login = async (username: string , password:string) =>
		{
				try
				{
						const postData = {
								username : username,
								password :password
						}
						const {data} = await api.post("/auth/login", postData)
						if (!data.username)
						{
								throw new Error("User not found !")
						}
						localStorage.setItem('token', data.token)
						setToken(data.token)
						setUser(data.username)
						return ({success : true})
				}
				catch(err : any)
				{
						return({success : false , error : err.message})
				}
		}

		const register = async (username: string , password:string, email:string) =>
		{
				try
				{
						const postData = {
								username : username,
								password :password,
								email : email
						}
						await api.post("/users/register", postData)
						return ({success : true})
				}
				catch(err : any)
				{
						return({success : false , error : err.message})
				}
		}
		
		const logout = async() => {
				setToken(null)
				setUser(null)
				localStorage.removeItem('token')
		}

		const connectSocket = () => {
			if (!user || socket?.connected) {
				return;
			}

			const newSocket = io("http://localhost:3000", {
				withCredentials: true,
				transports: ["websocket"],
				auth: {
					token: `Bearer ${token}`
				}
			})
			newSocket.on("connect", () => {});
			newSocket.on("onlineUser", (usernames: string[]) => {
				setOnlineUsers(usernames);
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
				token,
				login,
				logout,
				register,
				loading,
				isAuthenticated: !!user,
				connectSocket, disconnectSocket,
				socket, onlineUsers
		}

		return(
				<AuthContext.Provider value={value}>
						{children}
				</AuthContext.Provider>
				
		)
}

export { useAuth, AuthProvider }