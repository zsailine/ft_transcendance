import { 
    IoHome , 
    IoSettings, 
    IoGameController,
    IoChatboxEllipsesSharp
} from "react-icons/io5";
import { RiPingPongLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {

    const navigate = useNavigate();

    return(
        <div className="backdrop-blur-xl rounded-r-xl bg-cyan-800/5 flex flex-col justify-between h-full shadow-lg shadow-cyan-500/50  text-white">
            <div className="flex flex-col ">
                <div
                    className="text-amber-400 w-full flex gap-3.5 px-4 py-2 items-center shadow-xs shadow-cyan-800/10">
                    <h2 className="text-xl">Trascendence</h2>
                    <RiPingPongLine />
                </div>
                <div
                    onClick={ () => navigate("/dashboard/")}
                    className="w-full flex gap-3.5 px-4 py-2 items-center shadow-xs shadow-cyan-800/10">
                    <IoHome className="text-cyan-500"/>
                    <h2>Profil</h2>
                </div>
                <div 
                    onClick={ () => navigate("/dashboard/settings")}
                    className="w-full flex gap-3.5 px-4 py-2 items-center shadow-xs shadow-cyan-800/10">
                    <IoSettings className="text-cyan-500" />
                    <h2>Settings</h2>
                </div>
                <div
                    onClick={ () => navigate("/dashboard/play")}
                    className="w-full flex gap-3.5 px-4 py-2 items-center shadow-xs shadow-cyan-800/10">
                    <IoGameController className="text-cyan-500" />
                    <h2>Play Games</h2>
                </div>
            </div>
            <div>
                <div className="flex gap-3.5 px-4 py-2 items-center border-t-1 border-cyan-800/10">
                    <IoChatboxEllipsesSharp className="text-cyan-500" />
                    <h2>Discussion</h2>
                </div>
            </div>
        </div>
    )
}
export default Sidebar