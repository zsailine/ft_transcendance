
import { useNavigate } from "react-router-dom";
import Avatar from "../../Components/Dashboard/Settings/Avatar";
import CoverInput from "../../Components/Dashboard/Settings/Cover";
import InputText from "../../Components/Dashboard/Settings/InputText";
import { useDashboard } from "../../Providers/DashboardProvider";
import api from "../../Utils/axios";


const Settings = () => {

    const navigate = useNavigate()
    const { 
            username,
            avatar, 
            coverImage,
            nickname,
            refreshUserData
           } = useDashboard();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const body = new FormData();
        body.append('username', username as string);
        body.append('nickname', nickname as string);
        body.append('avatar', avatar as any); ;
        body.append('cover_image', coverImage as any); ;
        await api.post('/users/update' , body)
        .then(() => {
            refreshUserData && refreshUserData();
            navigate('/dashboard/')
        })
        .catch((error) => {
            console.error("Error updating profile:", error);
        });
    }

       const hoverEffect = "hover:z-10 hover:scale-105 transition-transform transition-colors duration-300 ease-in-out transform-gpu origin-center"


    return (
        <>
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 border border-amber-100/10 rounded-lg shadow-md shadow-amber-100/20 py-6 bg-cyan-800/5  ">
                <div className="rounded-lg text-white text-center ml-4 mr-3 my-8">
                    <h1 className="text-3xl">Profil management</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="sm:col-span-4">
                        <InputText />
                    </div>
                    <div className="mt-4 col-span-full">
                        <Avatar />
                    </div>
                    <div className="mt-4 col-span-full">
                        <CoverInput />
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button 
                            type="button" 
                            className={`cursor-pointer text-sm/6 font-semibold text-white ${hoverEffect}`}
                            >
                            Cancel</button>
                        <button
                            onClick = {handleSubmit}
                            type="submit" 
                            className={`cursor-pointer rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${hoverEffect}`}>Update</button>
                    </div>
                </form>
            </div>

        </>
    )
}

export default Settings