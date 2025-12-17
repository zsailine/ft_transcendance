import { motion } from "framer-motion";
import Story from "../../Components/Profil/Story";
import { IoMdClose } from "react-icons/io";
import { useDashboard } from "../../Providers/DashboardProvider";
import api from "../../Utils/axios";
import { useEffect, useState } from "react";
interface ProfilProps {
    username: string | null;
}


export default function OverlayMatches({ username }: ProfilProps) {
    const [matches, setMatches] = useState<any>(null);
    const { setIsOverlayOpen } = useDashboard();
    async function getMatches() {
        const response = await api.get(`/matches/${username}`);
        if (response.data.length)
            setMatches(response.data);
    }
    useEffect(() => {
        getMatches();
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute z-100 h-[80%] overflow-auto w-full flex flex-col items-center justify-center 
               mx-auto max-w-xl px-4 sm:px-6 lg:px-8 border border-amber-100/10 
            rounded-lg shadow-md shadow-amber-100/20 py-6 bg-cyan-800/20
            top-1/2           
        left-1/2          
        transform         
        -translate-x-1/2  
        -translate-y-1/2 "
        >
            <h1 className="text-3xl text-white mb-4">All Matches</h1>
            <div className="w-full">
                {matches && matches.map((match: any) => (
                    <Story key={match.id} username={username} match={match} />
                ))}
                {!matches && <p>No matches to show</p>}
            </div>
            <div className="absolute top-4 right-4 text-cyan-400 text-3xl cursor-pointer">
                <IoMdClose onClick={() => setIsOverlayOpen(false)} />
            </div>
        </motion.div>
    );
}