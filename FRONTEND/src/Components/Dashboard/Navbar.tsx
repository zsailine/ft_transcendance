import { IoMdNotifications } from "react-icons/io";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAuth } from "../../Providers/AuthProvider";


const Navbar = () => {

    const {logout} = useAuth()

    return (
        <>
            <div className="mt-2.5 flex gap-5 text-white" >
                <div className="flex items-center h-max py-2.5 px-2.5 rounded-[50%]  backdrop-blur-xl bg-cyan-800/5 shadow-md shadow-cyan-500/50">
                    <IoMdNotifications className="text-cyan-500" />
                </div>
                <div
                    onClick={logout} 
                    className="mr-1.5 py-1.5 px-6 flex items-center h-max gap-2 backdrop-blur-xl rounded-xl bg-cyan-800/5 shadow-md shadow-cyan-500/50">
                    Logout
                    <RiLogoutBoxRLine className="text-amber-400" />
                </div>     
            </div>
        </>
    )
}

export default Navbar