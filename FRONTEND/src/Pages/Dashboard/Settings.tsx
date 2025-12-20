
import { useNavigate } from "react-router-dom";
import Profil from "../../Components/Dashboard/Settings/Profil";
import Game from "../../Components/Dashboard/Settings/Game";
import { useDashboard } from "../../Providers/DashboardProvider";
import api from "../../Utils/axios";
import { useState } from "react";
import { toast } from "react-toastify";


const Settings = () => {

    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<"profil" | "game">("profil");
    const {
        username,
        avatar,
        coverImage,
        nickname,
        refreshUserData,
        theme
    } = useDashboard();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const body = new FormData();
        body.append('username', username as string);
        body.append('nickname', nickname as string);
        body.append('avatar', avatar as any);;
        body.append('cover_image', coverImage as any);;
        await api.post('/users/update', body)
            .then(() => {
                refreshUserData && refreshUserData();
                toast.success("Update successful");
                navigate('/dashboard/')
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
            });
    }
    const updateColors =  async (e: any) => {
        if (!theme || !username) return ;
        e.preventDefault();
        await api.post(`/users/updateColor`, theme)
            .then(() => {
                refreshUserData && refreshUserData();
                toast.success("Update successful");
                navigate('/dashboard/')
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
            });
    }

    const hoverEffect = "hover:z-10 hover:scale-105 transition-transform transition-colors duration-300 ease-in-out transform-gpu origin-center"


    return (
        <div>
            <div className="flex items-center justify-center text-white font-semibold text-lg mb-4">

                <div
                    className={`cursor-pointer px-3 py-1 ${activeTab === "profil" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-300"}`}
                    onClick={() => setActiveTab("profil")}>
                    Profil
                </div>
                <div
                    className={`cursor-pointer px-3 py-1 ${activeTab === "game" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-300"}`}
                    onClick={() => setActiveTab("game")}>
                    Game
                </div>

            </div>
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 border border-amber-100/10 
            rounded-lg shadow-md shadow-amber-100/20 py-6 bg-cyan-800/5 ">
                {activeTab === "profil" && (
                    <Profil handleSubmit={handleSubmit} hoverEffect={hoverEffect} />
                )}
                 {activeTab === "game" && (
                    <Game  hoverEffect={hoverEffect} handleSubmit={updateColors}/>
                )}
            </div>

        </div>
    )
}

export default Settings