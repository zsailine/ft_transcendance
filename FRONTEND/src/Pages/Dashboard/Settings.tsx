
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
           } = useDashboard();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const body = new FormData();
        body.append('username', username as string);
        body.append('nickname', nickname as string);
        body.append('avatar', avatar as any); ;
        body.append('cover_image', coverImage as any); ;
        await api.post('/users/update' , body)
        .then((response) => {
            console.log("Profile updated successfully:", response.data);
            navigate('/dashboard/')
        })
        .catch((error) => {
            console.error("Error updating profile:", error);
        });
    }



    return (
        <>
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-lg text-white text-center ml-4 mr-3 my-8">
                    <h1 className="text-3xl">Profil management</h1>
                </div>
                <form >
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
                        <button type="button" className="text-sm/6 font-semibold text-white">Cancel</button>
                        <button
                            onClick = {handleSubmit}
                            type="submit" 
                            className="rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save</button>
                    </div>
                </form>
            </div>

        </>
    )
}

export default Settings