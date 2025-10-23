import { useState , createContext, useContext, useEffect} from "react";
import api from "../Utils/axios";

// interface User {
//     token : string
//     username : string
// }

interface AuthInterface {
    token : string | null,
    user : string | null,
    login : (username:string, password:string) => object,
    logout : () => void,
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
    const [loading, setLoading] = useState<boolean>(false)
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

    const verifyToken = async () =>
    {
        try
        {
            const {data} = await api.get("/auth/me")
            console.log(data)
            if (data)
                setUser(data.username)
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
    }, [])

    const login = async (username: string , password:string) =>
    {
        try
        {
            const postData = {
                username : username,
                password :password
            }
            const {data} = await api.post("/auth/login", postData)
            console.log(data)
            if (!data.username)
                throw new Error("User not found !")
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

    
    const logout = async() => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
    }

    const value = {
        user,
        token,
        login,
        logout,
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