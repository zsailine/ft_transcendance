import Navbar from "../Components/Dashboard/Navbar"
import Sidebar from "../Components/Dashboard/Sidebar"
import { Outlet } from 'react-router-dom';


const Dashboard = () => {
    return (
        <>
            <div className="bg-[#101728] h-[100vh] flex">
                <div className="sticky w-max lg:w-1/6 ">
                    <Sidebar />
                </div>
                <div className="w-full lg:w-5/6 overflow-y-auto h-screen flex flex-col">
                    <div className="mx-1.5 sm:mx-6  relative flex flex-col h-full">
                        <div className="flex justify-end h-max mb-10">
                            <Navbar />
                        </div>
                        <div className="flex-1 min-h-0 mb-6">
                            < Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard