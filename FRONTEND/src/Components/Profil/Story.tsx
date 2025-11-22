import { ImTextColor } from "react-icons/im";
import { MdDateRange } from "react-icons/md";

interface matchInterface {
    player1: string;
    player2: string;
    winner: string;
    score_p1: number;
    score_p2: number;
    played_at: string;
}

const Story = ({username, match} : {username: string | null, match: matchInterface}) => {
    return (
        <div className="flex items-center justify-between rounded-lg p-4 mb-4 border border-cyan-300">
            <div className="flex items-center gap-4">
                <img className="rounded-[50%]" width={40} height={40} src="/images/avatar.jpg" alt="avatar" />
                <h1>{username === match.player2 ? match.player1 : match.player2}</h1>
            </div>
            <p className={username === match.winner ? `text-green-400 text-2xl` : `text-red-400 text-2xl`}>{`${match.score_p1} : ${match.score_p2}`}</p>
            <div className="flex items-center gap-2 text-amber-400">
                <MdDateRange />
                <p>{match.played_at}</p>
            </div>
        </div>
    )
}

export default Story