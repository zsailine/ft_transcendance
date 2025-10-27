import Navbar from "../Components/Dashboard/Navbar"
import Sidebar from "../Components/Dashboard/Sidebar"
import { Outlet } from 'react-router-dom';


const Dashboard = () => {
    return(
        <>
            <div className="bg-[#101728] h-screen flex">
                <div className="w-1/5">
                    <Sidebar/>
                </div>
                <div className="w-4/5">
                    <div className="flex justify-end h-max">
                        <Navbar />
                    </div>
                    < Outlet/>
                </div>
            </div>
        </>
    )
}

export default Dashboard