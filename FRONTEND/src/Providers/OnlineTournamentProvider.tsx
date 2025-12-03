import { createContext, useContext, useState } from "react";
import { Socket } from "socket.io-client";

interface OnlineTournamentInterface {
	text: string,
	setText: (result: string) => void,
    socket: Socket | null;
    setSocket: (result: Socket) => void
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

    const value = {
        text,
		setText,
        socket,
        setSocket
    }

    return (
        <OnlineTournamentContext.Provider value={value}>
            {children}
        </OnlineTournamentContext.Provider>
    )
}