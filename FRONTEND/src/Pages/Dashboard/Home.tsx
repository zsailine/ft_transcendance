import { useDashboard } from '../../Providers/DashboardProvider';
import Header from '../../Components/Home/Header';
import Play from '../../Components/Home/Play';
import LeaderBoard from '../../Components/Home/LeaderBoard';
import Achievements from '../../Components/Home/Achievements';
import { useEffect, useState } from 'react';
import type { UserInterface } from '../../Providers/ChatProvider';
import FriendProfil from '../../Components/Profil/FriendProfil';
import { getRelationship } from '../../Utils/getter';

const Home = () => {
    const { username } = useDashboard();
    const [ userProfil, setUserProfil ] = useState<UserInterface>({id: 0, username: "", avatar: null});
    const [ overlayed, setIsOverlayed ] = useState<boolean>(false);
    const [ relation, setRelation ] = useState<string | null>("");

    const handleClick = () => {
        setIsOverlayed((prev) => !prev);
    }

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
                        <Achievements viewAchievements={() => console.log('yo')} />
                    </div>
                    <LeaderBoard setter={setUserProfil} click={handleClick}/>
                </div>
            </div>

            {overlayed && userProfil && relation !== "blocked" &&
            <FriendProfil
                click={handleClick}
                user={userProfil}
                type="leaderboard"
                />}
        </div>
    );
};

export default Home;