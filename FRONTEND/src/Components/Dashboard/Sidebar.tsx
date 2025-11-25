import {
    IoHome,
    IoSettings,
    IoGameController,
    IoChatboxEllipsesSharp
} from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
import { RiPingPongLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FaTrophy } from "react-icons/fa6";

const Sidebar = () => {

    const navigate = useNavigate();

    const hoverEffect = "bg-gradient-to-r from-white-500 to-cyan-500/0 hover:from-white-500 hover:to-cyan-500 transition-colors duration-500 ease-in-out";

    return (
        <div className="backdrop-blur-xl rounded-r-xl bg-cyan-800/5 flex flex-col justify-between h-full shadow-lg shadow-cyan-500/50  text-white">
            <div className="flex flex-col ">
                <div
                    className="text-amber-400 flex gap-3.5 px-4 py-2 items-center shadow-xs shadow-cyan-800/10">
                    <h2 className="hidden text-xl lg:block">Transcendence</h2>
                    <RiPingPongLine/>
                </div>
                <div
                    onClick={() => navigate("/dashboard/")}
                    className={`cursor-pointer w-full flex gap-3.5 px-4 py-2 items-center shadow-xs shadow-cyan-800/10 ${hoverEffect} `}>
                    <IoHome className="text-cyan-500" />
                    <h2 className="hidden lg:block">Profil</h2>
                </div>
                <div
                    onClick={() => navigate("/dashboard/settings")}
                    className={`cursor-pointer w-full flex gap-3.5 px-4 py-2 items-center shadow-xs shadow-cyan-800/10 ${hoverEffect} `}>
                    <IoSettings className="text-cyan-500" />
                    <h2 className="hidden lg:block">Settings</h2>
                </div>
                <div
                    onClick={() => navigate("/dashboard/play")}
                    className={`cursor-pointer w-full flex gap-3.5 px-4 py-2 items-center shadow-xs shadow-cyan-800/10 ${hoverEffect} `}>
                    <IoGameController className="text-cyan-500" />
                    <h2 className="hidden lg:block">Play Games</h2>
                </div>
                <div
                    onClick={() => navigate("/dashboard/tournament")}
                    className={`cursor-pointer w-full flex gap-3.5 px-4 py-2 items-center shadow-xs shadow-cyan-800/10 ${hoverEffect} `}>
                    <FaTrophy className="text-cyan-500" />
                    <h2 className="hidden lg:block">Tournament</h2>
                </div>
                <div
                    onClick={() => navigate("/dashboard/friends")}
                    className={`cursor-pointer w-full flex gap-3.5 px-4 py-2 items-center shadow-xs shadow-cyan-800/10 ${hoverEffect} `}>
                    <FaUsers className="text-cyan-500" />
                    <h2 className="hidden lg:block">Friends</h2>
                </div>
            </div>
            <div>
                <div
                    onClick={() => navigate("/dashboard/discussion")}
                    className={`rounded-br-lg flex gap-3.5 px-4 py-2 items-center border-t-1 border-cyan-800/10 ${hoverEffect}`} >
                    <IoChatboxEllipsesSharp className="text-cyan-500" />
                    <h2 className="hidden lg:block">Discussion</h2>
                </div>
            </div>
        </div>
    )
}
export default Sidebar