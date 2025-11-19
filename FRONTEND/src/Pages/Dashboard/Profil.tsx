import { useDashboard } from "../../Providers/DashboardProvider";
import { useState , useEffect } from "react";
import { getImageUrlFromBlob } from "../../Utils/blob";
import Story from "../../Components/Profil/Story";

const Profil = () => {
    const { avatar, coverImage, username } = useDashboard();
    const [avatarURL, setAvatarURL] = useState<string | null>(null);
    const [coverURL, setCoverURL] = useState<string | null>(null);

    useEffect(() => {
        let url: string | null = getImageUrlFromBlob(avatar?.data);
        setAvatarURL(url);

        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [avatar]);

    useEffect(() => {
        let url: string | null = getImageUrlFromBlob(coverImage?.data);
        setCoverURL(url);

        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [coverImage]);

    const coverStyle = coverURL ? {
        backgroundImage: `url(${coverURL})`,
        
    } : {
        backgroundImage: "url(/images/cover.jpg)",
    };

    const avatarStyle = avatarURL ? {
        backgroundImage: `url(${avatarURL})`,
    } : {
        backgroundImage: "url(/images/avatar.jpg)",
    };

    return (
        <div className="rounded-lg text-white text-center ml-4 mr-2 my-8">
            <div 
                className="rounded-lg h-80"
                style={{ ...coverStyle, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="p-3 rounded-lg h-full bg-linear-65 from-cyan-200/15 to-cyan-800/30">
                    <h1 className="text-3xl font-bold">{username}</h1>
                    <p>More information</p>
                </div>
            </div>
            <div 
                className="size-32 rounded-full border-4 border-cyan-500 ml-6 mt-[-100px] mb-4" 
                style={{ ...avatarStyle, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <h1 className="text-4xl text-left mb-4">Match story</h1>
            <div className="sm:flex gap-8">
                <div className="w-3/4">
                    <Story/>
                    <Story/>
                    <Story/>
                    <Story/>
                    <Story/>

                </div>
                <div className="hidden md:block bg-[url(/images/aside_01.png)] bg-no-repeat bg-cover bg-center h-[400px] rounded w-1/4">

                </div>
            </div>
        </div>
    );
};

export default Profil