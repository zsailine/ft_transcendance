import type { ImageBuffer } from "../../Providers/DashboardProvider";
import { MdDateRange } from "react-icons/md";
import { getImageUrlFromBlob } from "../../Utils/blob";
import { useEffect, useState } from "react";
import api from "../../Utils/axios";
interface matchInterface {
    player1: string;
    player2: string;
    winner: string;
    score_p1: number;
    score_p2: number;
    played_at: string;
}
const Story = ({ username, match }: { username: string | null, match: matchInterface }) => {
    const [avatar, setAvatar] = useState<ImageBuffer | null>(null);
    const [avatarURL, setAvatarURL] = useState<string | null>(null);

    const opponent = username === match.player2 ? match.player1 : match.player2;

    // Charger l'avatar
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const response = await api.get(`/users/${opponent}/avatar`);
                if (active) setAvatar(response.data.avatar);
            } catch (err) {
                console.error(err);
            }
        })();

        return () => { active = false };
    }, [opponent]);

    useEffect(() => {
        if (!avatar) return;
        let url: string | null = getImageUrlFromBlob(avatar?.data);
        setAvatarURL(url);

        return () => {
           if (url) URL.revokeObjectURL(url);
        };
    }, [avatar]);

    return (
        <div className="flex items-center justify-between rounded-lg p-4 mb-4 border border-cyan-300">
            <div className="flex items-center gap-4">
                <img
                    className="rounded-full"
                    width={40}
                    height={40}
                    src={avatarURL ?? "/images/avatar.jpg"}
                    alt="avatar"
                />
                <h1>{opponent}</h1>
            </div>

            <p className={username === match.winner ? "text-green-400 text-2xl" : "text-red-400 text-2xl"}>
                {`${match.score_p1} : ${match.score_p2}`}
            </p>

            <div className="flex items-center gap-2 text-amber-400">
                <MdDateRange />
                <p>{match.played_at}</p>
            </div>
        </div>
    );
};

export default Story;
