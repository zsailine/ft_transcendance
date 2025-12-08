import { useEffect, useState } from "react";
import { useOnlineTournament } from "../../Providers/OnlineTournamentProvider";
export default function MatchMaking({aliases} : {aliases:string[]}) {
    const [numMatches] = useState(Math.floor(aliases.length / 2));
    const [text, setText] = useState("");
    const {socket} = useOnlineTournament();
    useEffect(() => {
        socket?.on("count", data => setText(data));
        return (() => {
            socket?.off("count", data => setText(data));
        })
    }, []);
    return (
        <div className="flex flex-col items-center space-y-6 w-full">
            <h3 className="text-2xl">{text}</h3>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Matchmaking</h2>
 
            {Array.from({ length: numMatches }).map((_, i) => (
                <div
                    key={i}
                    className="bg-gray-800 text-white rounded p-4 w-64 text-center"
                >
                    { aliases[i * 2] && aliases[i * 2 + 1] : 
                        {aliases[i * 2] vs aliases[i * 2 + 1]} ?
                        {aliases[i * 2] passed to the next round}
                    }
                </div>
            ))}
        </div>
    );
}
