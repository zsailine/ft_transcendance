import { useDashboard } from "../../Providers/DashboardProvider";
import { useState , useEffect } from "react";

const Profil = () => {
    const { avatar, coverImage } = useDashboard();
    const [avatarURL, setAvatarURL] = useState<string | null>(null);
    const [coverURL, setCoverURL] = useState<string | null>(null);

    useEffect(() => {
        let url: string | null = null;

        if (avatar?.data) {
            try {
                const uint8Array = new Uint8Array(avatar.data);
                const blob = new Blob([uint8Array], { type: 'image/png' });
                url = URL.createObjectURL(blob);
                setAvatarURL(url);
            } catch (error) {
                console.error('Error creating avatar URL:', error);
                setAvatarURL(null);
            }
        }

        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [avatar]);

    useEffect(() => {
        let url: string | null = null;

        if (coverImage?.data) {
            try {
                const uint8Array = new Uint8Array(coverImage.data);
                const blob = new Blob([uint8Array], { type: 'image/png' });
                url = URL.createObjectURL(blob);
                setCoverURL(url);
            } catch (error) {
                console.error('Error creating cover URL:', error);
                setCoverURL(null);
            }
        }

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
                    <h1 className="text-3xl font-bold">test0</h1>
                    <p>More information</p>
                </div>
            </div>
            <div 
                className="size-32 rounded-full border-4 border-cyan-500 ml-6 mt-[-100px] mb-4" 
                style={{ ...avatarStyle, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
        </div>
    );
};

export default Profil