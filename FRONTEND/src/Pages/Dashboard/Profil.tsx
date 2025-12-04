import { useDashboard } from "../../Providers/DashboardProvider";
import { useState, useEffect } from "react";
import { getImageUrlFromBlob } from "../../Utils/blob";
import Story from "../../Components/Profil/Story";
import OverlayMatch from "../../Components/Profil/OverlayMatch";
import GraphDisplayed from "../../Components/Profil/GraphDisplayed";
import api from "../../Utils/axios";
import WinLossChart from "../../Components/Profil/DonutGraph";

export interface statInterface {
    total_matches: number;
    total_losses: number;
    total_wins: number;
}

const Profil = () => {
    const defaultStats: statInterface = {
        total_matches: 0,
        total_losses: 0,
        total_wins: 0,
    };
    const { avatar, coverImage, username, nickname, isOverlayOpen, setIsOverlayOpen } = useDashboard();
    const [avatarURL, setAvatarURL] = useState<string | null>(null);
    const [coverURL, setCoverURL] = useState<string | null>(null);
    const [stats, setStats] = useState<statInterface>(defaultStats);
    const [matches, setMatches] = useState<any>(null);
    const [score, setScore] = useState<number>(0);

    async function getStats() {
        const response = await api.get(`/matches/stats/${username}`);
        if (response.data.total_matches)
            setStats(response.data);
    }
    async function getRecentMatches() {
        const response = await api.get(`/matches/${username}?limit=5&page=1`);
        if (response.data.data.length)
            setMatches(response.data.data);
    }
    useEffect(() => {
        if (!username) return;
        try {
            getStats();
            getRecentMatches();
            if ((stats.total_wins - stats.total_losses) > 0)
                setScore((stats.total_wins - stats.total_losses) * 10);
        }
        catch (error) {
            console.error(error);
        }
    }, [username, stats.total_wins, stats.total_losses]);
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

    const openOverlay = () => {
        setIsOverlayOpen(true)
    }

    return (
        <>
            {isOverlayOpen && <div className="fixed inset-0 z-20 bg-black/30 backdrop-blur-lg w-full h-full blur-2xl"></div>}
            <div className=" text-white text-center my-8">
                <div className="flex flex-col md:flex-row gap-10 md:gap-20 px-4 md:px-0">
                    <div className="w-full md:w-1/2">
                        <div
                            className="rounded-lg h-80"
                            style={{ ...coverStyle, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        >
                            <div className="flex justify-between text-left p-3 rounded-lg h-full bg-linear-65 from-cyan-200/15 to-cyan-800/30">
                                <div>
                                    <h1 className="text-3xl font-bold">{username}</h1>
                                    {nickname === "null" ? <p>Set your Tournament name </p> : <p className="text-xl italic">Tournament name : {nickname}</p>}
                                    <p></p>
                                </div>
                                <div className="text-right ">
                                    <p>Score</p>
                                    <p className="text-amber-400 text-3xl">{score} XP</p>
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
                        <div className="flex justify-between items-baseline mt-10">
                            <h1 className="text-4xl mb-4">Match history</h1>
                            <h1
                                className="text-xl text-blue-500 hover:text-blue-700 cursor-pointer mb-4"
                                onClick={() => openOverlay()}

                            >
                                ... view all
                            </h1>
                        </div>
                        <div className="sm:flex gap-8">
                            <div className="w-full">
                                {matches && matches.slice(0,3).map((match: any) => (
                                   <Story key={match.id} username={username} match={match} />
                                ))}
                                {!matches && <p>No matches to show</p>}

                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 mb-10">
                        <div className="rounded-lg h-fit shadow-amber-400 shadow-md p-5  mb-6">
                            <h1 className="text-4xl mt-12 mb-4">Win/Loss</h1>
                            <WinLossChart wins={stats?.total_wins} losses={stats.total_losses} />
                        </div>
                        <div className="shadow-amber-400 shadow-md p-5 mt-2 rounded-lg  h-fit">
                            <GraphDisplayed />
                        </div>
                    </div>
                </div>
            </div>
            {
                isOverlayOpen && (
                    <OverlayMatch matches={matches} username={username} />
                )
            }
        </>
    );
};

export default Profil