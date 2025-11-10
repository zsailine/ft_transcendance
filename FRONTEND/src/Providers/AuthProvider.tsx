import { useState , createContext, useContext, useEffect, use} from "react";
import api from "../Utils/axios";
import { toast } from "react-toastify";


interface AuthInterface {
    user : string | null,
    login : (username:string, password:string) => any,
    register : (username:string, password:string, email:string) => any, 
    logout : () => void,
    setUser : (username:string | null) => void,
    setLoading : (loading : boolean) => void,
    loading : boolean,
    isAuthenticated : boolean
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
                toast.error("User not found !")
                throw new Error("User not found !")
            }
            setUser(data.username)
            return ({success : true})
        }
        catch(err : any)
        {
            toast.error("User not found !")
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
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
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
        isAuthenticated: !!user
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
        
    ) 
    
    children
}



export { useAuth, AuthProvider }