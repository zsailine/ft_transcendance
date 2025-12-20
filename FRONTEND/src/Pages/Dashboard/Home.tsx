import { useDashboard } from '../../Providers/DashboardProvider';
import Header from '../../Components/Home/Header';
import Play from '../../Components/Home/Play';
import LeaderBoard from '../../Components/Home/LeaderBoard';
import { Achievements, type PlayerStatsInterface } from '../../Components/Home/Achievements';
import { useEffect, useState } from 'react';
import type { UserInterface } from '../../Providers/ChatProvider';
import FriendProfil from '../../Components/Profil/FriendProfil';
import { getRelationship } from '../../Utils/getter';
import api from '../../Utils/axios';
import OverlayAchievements from '../../Components/Profil/OverlayAchievement';

const Home = () => {
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

    const { username } = useDashboard();
    const [userProfil, setUserProfil] = useState<UserInterface>({ id: 0, username: "", avatar: null });
    const [overlayed, setIsOverlayed] = useState<boolean>(false);
    const [relation, setRelation] = useState<string | null>("");
    const [stats, setStats] = useState<PlayerStatsInterface>(defaultStats);
    const [page, setPage] = useState(0);
    async function getStats() {
        const response = await api.get(`/matches/stats/${username}`);
        if (response.data.total_matches)
            setStats(response.data);
    }
    const handleClick = () => {
        setIsOverlayed((prev) => !prev);
    }
    useEffect(() => {
        if (!username) return;
        getStats();
    }, [username]);
    useEffect(() => {
        getRelationship(userProfil?.username || "", setRelation);
    }, [userProfil]);

    return (
        <div className="min-h-screen text-white p-4 md:p-8 font-sans overflow-hidden relative">

            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
                <Header username={username} />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <Play />
                        <Achievements
                            type={0}
                            show={1}
                            buttonText={<>View All &rarr;</>}
                            PlayerStats={stats}
                            viewAchievements={() => setPage(1)}
                        />

                    </div>
                    <LeaderBoard setter={setUserProfil} click={handleClick} />
                </div>
            </div>

            {overlayed && userProfil && relation !== "blocked" &&
                <FriendProfil
                    click={handleClick}
                    user={userProfil}
                    type="leaderboard"
                />}
            {(page === 1 && username) && (
                <>
                    <div className="fixed inset-0 z-20 bg-black/30 backdrop-blur-lg w-full h-full blur-2xl"></div>
                    <div className="fixed inset-0 z-20 w-full h-full">
                        <OverlayAchievements quit={() => setPage(0)} username={username} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;