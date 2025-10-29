
import { IoMdPhotos } from "react-icons/io"
import { useDashboard } from "../../Providers/DashboardProvider"
import { useEffect } from "react";
import Avatar from "../../Components/Dashboard/Settings/Avatar";
import InputText from "../../Components/Dashboard/Settings/InputText";



const Settings = () => {
    const { nickname, setNickname } = useDashboard();

    useEffect(() => {
        console.log("Current nickname:", nickname);
    }, [nickname]);
    return (
        <>
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-lg text-white text-center ml-4 mr-3 my-8">
                    <h1 className="text-3xl">Profil management</h1>
                </div>
                <form>
                    <div className="sm:col-span-4">
                        <InputText />
                    </div>
                    <div className="mt-4 col-span-full">
                        <Avatar />
                    </div>
                    <div className="mt-4 col-span-full">
                        <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-white">
                            Cover photo
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                            <div className="text-center">
                                <IoMdPhotos aria-hidden="true" className="mx-auto size-12 text-gray-600" />
                                <div className="mt-4 flex text-sm/6 text-gray-400">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 hover:text-indigo-300"
                                    >
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs/5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </>
    )
}

export default Settings