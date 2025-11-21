import { useDashboard } from "../../Providers/DashboardProvider";
import { useState, useEffect } from "react";
import { getImageUrlFromBlob } from "../../Utils/blob";
import Story from "../../Components/Profil/Story";
import GraphDisplayed from "../../Components/Profil/GraphDisplayed";
import api from "../../Utils/axios";

interface statInterface {
    id: number;
    username: string;
    total_matches: number;
    total_losses: number;
    total_wins: number;
}
const Profil = () => {
    const { avatar, coverImage, username } = useDashboard();
    const [avatarURL, setAvatarURL] = useState<string | null>(null);
    const [coverURL, setCoverURL] = useState<string | null>(null);
    const [stats, setStats] = useState<statInterface | null>(null);
    const [matches, setMatches] = useState<any>(null);
    const [overlay, setOverlay] = useState(false);

    async function getStats() {
        const response = await api.get(`/matches/stats/${username}`);
        setStats(response.data);
    }
    async function getRecentMatches() {
        const response = await api.get(`/matches/${username}`);
        setMatches(response.data);
    }
    useEffect(() => {
        if (!username) return;
        try {
            getStats();
            getRecentMatches();
        }
        catch (error) {
            console.error(error);
        }
    }, [username]);
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
        <>
            <div className=" text-white text-center ml-4 mr-2 my-8">
                <div className="flex flex-col md:flex-row gap-8 items-end">
                    <div className="w-full md:w-1/2">
                        <div
                            className="rounded-lg h-80"
                            style={{ ...coverStyle, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        >
                            <div className="flex justify-between text-left p-3 rounded-lg h-full bg-linear-65 from-cyan-200/15 to-cyan-800/30">
                                <div>
                                    <h1 className="text-3xl font-bold">{username}</h1>
                                    <p>More information</p>
                                </div>
                                <div className="text-right ">
                                    <p>Score</p>
                                    <p className="text-amber-400 text-3xl">{stats?.total_matches}</p>
                                    <p>Victory</p>
                                    <p className="text-amber-400 text-3xl">{stats?.total_wins}</p>
                                    <p>Defeat</p>
                                    <p className="text-amber-400 text-3xl">{stats?.total_losses}</p>
                                </div>
                            </div>
                        </div>
                        <div
                            className="size-32 rounded-full border-4 border-cyan-500 ml-6 mt-[-100px] mb-4"
                            style={{ ...avatarStyle, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                        <GraphDisplayed />
                    </div>
                </div>
                <div className="flex justify-between items-baseline">
                    <h1 className="text-4xl mb-4">Match history</h1>
                    <h1
                        className="text-xl text-blue-500 hover:text-blue-700 cursor-pointer mb-4"
                        onClick={() => setOverlay(true)}
                    >
                        ... view all
                    </h1>
                </div>
                <div className="sm:flex gap-8">
                    <div className="w-full">
                        {matches && matches.map((match: any) => (
                            <Story key={match.id} username={username} match={match} />
                        ))}
                        {!matches && <p>Chargement des matchs...</p>}

                    </div>
                    {/* <div className="hidden md:block bg-[url(/images/aside_01.png)] bg-no-repeat bg-cover bg-center h-[400px] rounded w-1/4">

</div> */}
                </div>
            </div>
            {
                overlay && (
                    <h1>Hello</h1>
            )
            }
        </>
    );
};

export default Profil