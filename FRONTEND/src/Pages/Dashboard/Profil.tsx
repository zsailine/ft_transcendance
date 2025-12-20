import { useDashboard, type ImageBuffer } from "../../Providers/DashboardProvider";
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { getImageUrlFromBlob } from "../../Utils/blob";
import Story from "../../Components/Profil/Story";
import OverlayMatch from "../../Components/Profil/OverlayMatch";
import api from "../../Utils/axios";
import WinLossChart from "../../Components/Profil/DonutGraph";
import { Achievements, type PlayerStatsInterface } from "../../Components/Home/Achievements";
import OverlayAchievements from "../../Components/Profil/OverlayAchievement";

interface ProfilInterface {
    username: string | null,
    nickname: string | null,
    avatar: ImageBuffer | null,
    coverImage: ImageBuffer | null,
}

const Profil = () => {
    const defaultStats: PlayerStatsInterface = {
        total_matches: 0,
        total_wins: 0,
        total_losses: 0,
        xp: 0,
        streak: 0,
        total_duration: 0,
        returned: 0,
        max_streak: 0,
        maxCombo: 0,
        total_xp: 0,
        winning: 0,
    };
    const defaultProfil: ProfilInterface = {
        username: null,
        nickname: null,
        avatar: null,
        coverImage: null
    }
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const friendUsername = queryParams.get("username") || "";
    const { avatar, coverImage, username, nickname, isOverlayOpen, setIsOverlayOpen } = useDashboard();
    const [profile, setProfile] = useState<ProfilInterface>(defaultProfil);
    const [avatarURL, setAvatarURL] = useState<string | null>(null);
    const [coverURL, setCoverURL] = useState<string | null>(null);
    const [stats, setStats] = useState<PlayerStatsInterface>(defaultStats);
    const [matches, setMatches] = useState<any>(null);
    const [rank, setRank] = useState<any>(null);
    const [page, setPage] = useState(0);

    async function getLeaderBoard() {
        const response = await api.get(`/matches/rank/${profile.username}`);
        if (response.data)
            setRank(response.data);
    }
    async function assign() {
        if (friendUsername.length) {
            try {
                const response = await api.get(`/users/${friendUsername}`);
                const Profile: ProfilInterface = {
                    nickname: response.data.nickname,
                    username: response.data.username,
                    avatar: response.data.avatar,
                    coverImage: response.data.cover_image,
                }
                setProfile(Profile);
            }
            catch (error) { }
        }
        else {
            const Profile: ProfilInterface = {
                username: username,
                coverImage: coverImage,
                nickname: nickname,
                avatar: avatar
            }
            setProfile(Profile);
        }
    }
    async function getStats() {
        const response = await api.get(`/matches/stats/${profile.username}`);
        if (response.data.total_matches)
            setStats(response.data);
    }
    async function getRecentMatches() {
        const response = await api.get(`/matches/${profile.username}?size=5`);
        if (response.data.length)
            setMatches(response.data);
    }
    useEffect(() => {
        if (!username) return;
        assign();
    }, [username, friendUsername])
    useEffect(() => {
        if (!profile.username) return;
        try {
            getStats();
            getRecentMatches();
            getLeaderBoard();
        }
        catch (error) {
            console.error(error);
        }
    }, [profile.username]);
    useEffect(() => {
        let url: string | null = getImageUrlFromBlob(profile.avatar?.data);
        setAvatarURL(url);

        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [profile.avatar]);

    useEffect(() => {
        let url: string | null = getImageUrlFromBlob(profile.coverImage?.data);
        setCoverURL(url);

        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [profile.coverImage]);

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
            {profile.username ?
                <>
                    {isOverlayOpen && <div className="fixed inset-0 z-20 bg-black/30 backdrop-blur-lg w-full h-full blur-2xl"></div>}
                    <div className=" text-white text-center my-8 mx-8">
                        <div className="flex flex-col md:flex-row gap-10 md:gap-20 px-4 md:px-0">
                            <div className="w-full md:w-1/2">
                                <div
                                    className="rounded-lg h-80"
                                    style={{ ...coverStyle, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                >
                                    <div className="flex justify-between text-left p-3 rounded-lg h-full bg-linear-65 from-cyan-200/15 to-cyan-800/30">
                                        <div>
                                            <h1 className="text-3xl font-bold">{profile.username}</h1>
                                            <p className="text-xl italic">Rank : {rank?.rank}</p>
                                            <p></p>
                                        </div>
                                        <div className="text-right ">
                                            <p>Score</p>
                                            <p className="text-amber-400 text-3xl">{stats?.xp} XP</p>
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
                                        {matches && matches.map((match: any) => (
                                            <Story key={match.id} username={profile.username} match={match} shouldClick={false} />
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
                                <Achievements
                                    type={0}
                                    show={1}
                                    buttonText={<>View All &rarr;</>}
                                    PlayerStats={stats}
                                    viewAchievements={() => setPage(1)}
                                />

                            </div>
                        </div>
                    </div>
                    {
                        isOverlayOpen && (
                            <div className="fixed inset-0 z-20 w-full h-full">
                                <OverlayMatch username={profile.username} />
                            </div>
                        )
                    }
                    {(page === 1 && username) && (
                        <>
                            <div className="fixed inset-0 z-20 bg-black/30 backdrop-blur-lg w-full h-full blur-2xl"></div>
                            <div className="fixed inset-0 z-20 w-full h-full">
                                <OverlayAchievements quit={() => setPage(0)} username={username} />
                            </div>
                        </>
                    )}
                </> :
                <div className="flex flex-1 items-center justify-center min-h-[60vh]">
                    <div className="flex justify-center text-white items-center flex-col">
                        <svg
                            className="h-16 w-16 mb-4 opacity-50"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h1 className="font-serif text-xl">This username doesn't exist</h1>
                    </div>
                </div>
            }
        </>
    );
};

export default Profil