import { useDashboard } from "../../../Providers/DashboardProvider";
import { useRef, useState , useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { getImageUrlFromBlob } from "../../../Utils/blob";


const Avatar = () => {
    const ImageRef = useRef<HTMLInputElement | null>(null);
    const { avatar, setAvatar } = useDashboard()

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [avatarURL, setAvatarURL] = useState<string | null>(null);


    useEffect(() => {
        let url: string | null = getImageUrlFromBlob(avatar?.data);
        setAvatarURL(url);
    }, [avatar]);

    const handleChange = (e: any) => {
        setAvatar(e.target?.files[0]);
        setSelectedFile(e.target?.files[0]);
    }

    return (

        <>
            <label className="block text-sm/6 font-medium text-white">
                Avatar photo
            </label>
            <input
                ref={ImageRef}
                onChange={handleChange}
                type="file"
                style={{ display: "none" }}
            />
            <div className="mt-2 flex items-center gap-x-6">
                <div className="relative">
                    {selectedFile ? (
                        <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="avatar"
                            className="h-20 w-20 rounded-full bg-gray-800 object-cover cursor-pointer"
                        />
                    ) : (
                        <img
                            src={avatarURL ? avatarURL : "/images/avatar.jpg"}
                            alt=""
                            className="h-20 w-20 rounded-full bg-gray-800 object-cover cursor-pointer"
                        />
                    )}
                    <FaCirclePlus
                        onClick={() => ImageRef.current?.click()}
                        className="absolute -bottom-0 -right-0 h-6 w-6 text-cyan-400 cursor-pointer"
                    />
                </div>
            </div>
        </>
    )
}

export default Avatar;