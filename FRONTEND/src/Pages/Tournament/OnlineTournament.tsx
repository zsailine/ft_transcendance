import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useDashboard } from "../../Providers/DashboardProvider";
import { useOnlineTournament } from '../../Providers/OnlineTournamentProvider';
import { toast } from "react-toastify";
import Selection from './Selection';
import TournamentForm from './TournamentForm';

export default function TournamentList() {
    const { username } = useDashboard();
    const [AllTournament, setAllTournament] = useState<any[]>([]);
    // const [selectedTournament, setSelectedTournament] = useState<any>(null);
    const { setSocket, page } = useOnlineTournament();

    useEffect(() => {
        if (!username) return;
        const s = io("http://localhost:3000", {
            withCredentials: true,
            path: "/online/socket.io",
            transports: ["websocket"],
        });
        setSocket(s);
        s.emit("tournament", username);
        s.on("list", data => {
            setAllTournament(data);
        })
        s.on("error", () => toast.error("An error occured"));
        return () => {
            s.disconnect();
        };
    }, [username])

    return (
        <>
            {page === 1 && <Selection AllTournament={AllTournament} />}
            {page === 2 && <TournamentForm />}
        </>
    );
}