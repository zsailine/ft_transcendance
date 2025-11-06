import Navbar from "../Components/Dashboard/Navbar"
import Sidebar from "../Components/Dashboard/Sidebar"
import { Outlet } from 'react-router-dom';


const Dashboard = () => {
    return(
        <>
            <div className="bg-[#101728] min-h-screen flex">
                <div className="z-20 w-full md:w-1/5 lg:w-1/6 ">
                    <Sidebar/>
                </div>
                <div className="relative w-full md:w-4/5 lg:w-5/6">
                    <div className="flex justify-end h-max mb-10">
                        <Navbar />
                    </div>
                    <div className="mb-6">
                        < Outlet/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard