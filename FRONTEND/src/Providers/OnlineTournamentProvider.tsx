import { createContext, useContext, useState } from "react";
import { Socket } from "socket.io-client";
import type { TournamentInterface } from "../Pages/Tournament/TournamentTree";
interface OnlineTournamentInterface {
	text: string,
	setText: (result: string) => void,
    socket: Socket | null;
    setSocket: (result: Socket) => void,
    page: number,
    setPage: (result: number) => void,
    tournament: TournamentInterface | null,
    setTournament: (result: TournamentInterface | null) => void,
}

export const OnlineTournamentContext = createContext<OnlineTournamentInterface | null>(null);

export const useOnlineTournament = () => {
	const context = useContext(OnlineTournamentContext);
	if (!context)
		throw new Error("Error in context");
	return context
}

export const OnlineTournamentProvider = ({ children }: any) => {
    const [text, setText] = useState<string>("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [page, setPage] = useState<number>(1);
    const [tournament, setTournament] = useState<TournamentInterface | null>(null);

    const value = {
        text,
		setText,
        socket,
        setSocket,
        page,
        setPage,
        tournament,
        setTournament
    }

    return (
        <OnlineTournamentContext.Provider value={value}>
            {children}
        </OnlineTournamentContext.Provider>
    )
}