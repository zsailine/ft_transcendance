import { createContext, useContext, useEffect, useState } from "react";
import api from "../Utils/axios";
import { useAuth } from "./AuthProvider";

export interface ImageBuffer {
  type: "Buffer";
  data: number[];
}

interface DashboardInterface {
    username: string | null,
    setUsername: (username: string) => void,
    nickname: string | null,
    setNickname: (nickname: string) => void,
    avatar: ImageBuffer | null,
    setAvatar: (avatar: ImageBuffer) => void,
    coverImage: ImageBuffer | null,
    setCoverImage: (coverImage: ImageBuffer) => void,
    refreshUserData: () => void,
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
    const [username, setUsername] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string>("");
    const [avatar, setAvatar] = useState<ImageBuffer | null>(null);
    const [coverImage, setCoverImage] = useState<ImageBuffer | null>(null);
    const { user } = useAuth()

    const refreshUserData = async () => {
        if (user)
        {           
            try {
                const response = await api.get(`/users/${user}`);
                setNickname(response.data.nickname);
                setAvatar(response.data.avatar);
                setCoverImage(response.data.cover_image);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    }
    useEffect (() =>  {
        refreshUserData();
    }, [])

    useEffect(() => {
        if (user)
        {           
            api.get(`/users/${user}`)
                .then((response) => {
                    setUsername(response.data.username);
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
        username,
        setUsername,
        nickname,
        setNickname,
        avatar,
        setAvatar,
        coverImage,
        setCoverImage,
        refreshUserData
    }

    return (
        <DasboardContext.Provider value={value}>
            {children}
        </DasboardContext.Provider>
    )
}