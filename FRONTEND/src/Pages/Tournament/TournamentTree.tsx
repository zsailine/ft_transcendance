import { useEffect, useRef, useState } from 'react';
import { useOnlineTournament } from '../../Providers/OnlineTournamentProvider';
import WaitingPlayer from '../../Components/Tournament/WaitingPlayer';
import MatchMaking from './MatchMaking';
export interface TournamentMatch {
	matchId: string,
	round: number,
	player1: string,
	player2: string,
	winner: string
}
export interface TournamentInterface {
	id: string;
	name: string;
	maxPlayers: number;
	players: any;
	currentPlayers: number;
	status: "waiting" | "playing" | "Full";
	matches: TournamentMatch[];
}

export function TournamentTree({ tournament }: { tournament: TournamentInterface | null }) {
	if (!tournament) return <div>Chargement du tournoi...</div>;
	const { socket, id,} = useOnlineTournament();
	const startedRef = useRef(false);
	const [player, setPlayer] = useState<string[]>([]);
	const [ page, setPage ] = useState(3);

	useEffect(() => {
		socket?.on("started", () => {
			startedRef.current = true;
		});
		socket?.on("matchmaking", data => {
			setPlayer(data);
			setPage(4);
		})
		return () => {
			socket?.off("started", () => {
				startedRef.current = true;
			});
			if (startedRef.current) {
				socket?.emit("leave", id);
			}
		};
	}, []);
	return (
		<>
			{page === 3 && <WaitingPlayer tournament={tournament} />}
			{page === 4 && <MatchMaking aliases={player}/>}
		</>
	);
}
