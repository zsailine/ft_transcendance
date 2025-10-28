import { createContext, useContext, useEffect, useState } from "react";
import api from "../Utils/axios";
import { useAuth } from "./AuthProvider";


interface DashboardInterface {
    nickname: string | null,
    setNickname: (nickname: string) => void,
    avatar: string | null,
    setAvatar: (avatar: string) => void,
    coverImage: string | null,
    setCoverImage: (coverImage: string) => void
}

export const DasboardContext = createContext<DashboardInterface | null>(null);

export const useDashboard = () => {
    const context =  useContext(DasboardContext)
    if (!context)
        throw new Error("Error in context");
    return context
}

export const DashboardProvider = ({children} : any) =>
{
    const [nickname, setNickname] = useState<string>("");
    const [avatar, setAvatar] = useState<string>("");
    const [coverImage, setCoverImage] = useState<string>("");
    const { user } = useAuth()

    useEffect(() => {
        if (user)
        {
            
            api.get(`/users/${user}`)
                .then((response) => {
                    setNickname(response.data.nickname);
                    setAvatar(response.data.avatar);
                    setCoverImage(response.data.cover_image);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                }); 
        }
    }, [user]);

    const value = {
        nickname,
        setNickname,
        avatar,
        setAvatar,
        coverImage,
        setCoverImage
    }

    return (
        <DasboardContext.Provider value={value}>
            {children}
        </DasboardContext.Provider>
    )
}