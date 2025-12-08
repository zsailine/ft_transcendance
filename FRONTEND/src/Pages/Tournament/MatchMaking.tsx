import { useEffect, useState } from "react";
import { useOnlineTournament } from "../../Providers/OnlineTournamentProvider";
export default function MatchMaking({ aliases }: { aliases: string[] }) {
    const [numMatches] = useState(Math.floor(aliases.length / 2));
    const [text, setText] = useState("");
    const { socket } = useOnlineTournament();

    useEffect(() => {
        const handler = (data: string) => setText(data);

        socket?.on("count", handler);

        return () => {
            socket?.off("count", handler);
        };
    }, [socket]);

    return (
        <div className="flex flex-col items-center space-y-6 w-full">
            <h3 className="text-2xl text-cyan-300">{text}</h3>

            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                Matchmaking
            </h2>

            {Array.from({ length: numMatches }).map((_, i) => {
                const p1 = aliases[i * 2];
                const p2 = aliases[i * 2 + 1];

                return (
                    <div
                        key={i}
                        className="
                    text-white 
                    rounded-xl 
                    p-4 
                    w-64 
                    text-center 
                    border 
                    border-cyan-500/40 
                    shadow-lg 
                    shadow-cyan-500/20
                "
                    >
                        {p1 && p2 ? (
                            <span className="text-cyan-300">{p1} <span className="text-blue-400">vs</span> {p2}</span>
                        ) : p1 ? (
                            <span className="text-cyan-300">{p1} passe au round suivant</span>
                        ) : (
                            <span className="text-cyan-500">Match vide</span>
                        )}
                    </div>
                );
            })}
        </div>

    );
}

