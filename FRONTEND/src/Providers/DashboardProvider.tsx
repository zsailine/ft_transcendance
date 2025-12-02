import { createContext, useContext, useEffect, useState } from "react";
import api from "../Utils/axios";
import { useAuth } from "./AuthProvider";

export interface ImageBuffer {
    type: "Buffer";
    data: number[];
}

export interface ThemeColors {
    paddle1: string;
    paddle2: string;
    ball: string;
    boardBackground: string;
    boardBorder: string;
    score: string;
    slide?: boolean;
    paddleSpeed?: number;
};

interface DashboardInterface {
    username: string | null,
    setUsername: (username: string) => void,
    nickname: string | null,
    setNickname: (nickname: string) => void,
    avatar: ImageBuffer | null,
    setAvatar: (avatar: ImageBuffer) => void,
    coverImage: ImageBuffer | null,
    setCoverImage: (coverImage: ImageBuffer) => void,
    theme: ThemeColors | null,
    setTheme: React.Dispatch<React.SetStateAction<ThemeColors>>;
    refreshUserData: () => void,
}

export const DasboardContext = createContext<DashboardInterface | null>(null);

export const useDashboard = () => {
    const context = useContext(DasboardContext)
    if (!context)
        throw new Error("Error in context");
    return context
}

export const DashboardProvider = ({ children }: any) => {
    const [username, setUsername] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string>("");
    const [avatar, setAvatar] = useState<ImageBuffer | null>(null);
    const [coverImage, setCoverImage] = useState<ImageBuffer | null>(null);
    const [theme, setTheme] = useState<ThemeColors>({
        paddle1: "",
        paddle2: "",
        ball: "",
        boardBackground: "",
        boardBorder: "",
        score: "",
        slide: false,
        paddleSpeed: 250,
    });
    const { user } = useAuth()

    const refreshUserData = async () => {
        if (user) {
            try {
                const response = await api.get(`/users/${user}`);
                setNickname(response.data.nickname);
                setUsername(response.data.username);
                setAvatar(response.data.avatar);
                setCoverImage(response.data.cover_image);
                setTheme({
                    paddle1: response.data.paddle1_color,
                    paddle2: response.data.paddle2_color,
                    ball: response.data.ball_color,
                    boardBackground: response.data.board_background,
                    boardBorder: response.data.board_border,
                    score: response.data.score_color,
                    slide: response.data.slide,
                    paddleSpeed: response.data.paddle_speed,
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    }
    useEffect(() => {
        refreshUserData();
    }, [])

    useEffect(() => {
        if (user) {
            refreshUserData();
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
        refreshUserData,
        theme,
        setTheme
    }

    return (
        <DasboardContext.Provider value={value}>
            {children}
        </DasboardContext.Provider>
    )
}