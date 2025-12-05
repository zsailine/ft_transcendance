import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useDashboard } from "../../Providers/DashboardProvider";
import { useOnlineTournament } from '../../Providers/OnlineTournamentProvider';
import { toast } from "react-toastify";
import Selection from './Selection';
import TournamentForm from './TournamentForm';
import { TournamentTree, type TournamentInterface } from './TournamentTree';

export default function TournamentList() {
    const { username } = useDashboard();
    const [AllTournament, setAllTournament] = useState<TournamentInterface[]>([]);
    const { setSocket, page, setPage, setTournament, tournament,setId } = useOnlineTournament();

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
        s.on("leaved", () => {
            setPage(1);
            setId("");
        })
        s.on("joined", (data) => {
            setTournament(data);
            setId(data.id);
            setPage(3);
        })
        s.on("update", data => {
            setTournament(data);
        });
        s.on("error", () => toast.error("An error occured"));
        return () => {
            s.disconnect();
        };
    }, [username])

    return (
        <>
            {page === 1 && <Selection AllTournament={AllTournament} />}
            {page === 2 && <TournamentForm />}
            {page === 3 && <TournamentTree tournament={tournament} />}
        </>
    );
}