import type { UserInterface } from "../../Providers/ChatProvider";
import { getImageUrlFromBlob } from "../../Utils/blob";
import { useEffect, useState } from "react";

const Rank = ({ player, click, setter }: { player: any, click: () => void, setter: (user: UserInterface) => void}) => {
	const [imgUrl, setImgUrl] = useState<string | null>(null);
	useEffect(() => {
		let url: string | null = getImageUrlFromBlob(player.avatar);
		setImgUrl(url);
		return () => {
			if (url) URL.revokeObjectURL(url);
		};
	}, [player.avatar]);
	const avatarStyle = imgUrl ? {
		backgroundImage: `url(${imgUrl})`,
	} : {
		backgroundImage: "url(/images/avatar.jpg)",
	};

	return (
		<tr className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0" onClick={() => {
			click();
			setter({
				id: player.rank,
				username: player.username,
				avatar: player.avatar
			})
		}}>
			<td className="py-4 pl-2 font-bold w-12">
				{player.rank === 1 && <span className="text-amber-400 text-lg">#1</span>}
				{player.rank === 2 && <span className="text-slate-300 text-lg">#2</span>}
				{player.rank === 3 && <span className="text-orange-700 text-lg">#3</span>}
				{player.rank > 3 && <span className="text-slate-500">#{player.rank}</span>}
			</td>
			<td className="py-4">
				<div className="flex items-center gap-3">
					<div
						className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-white/10"
						style={{ ...avatarStyle, backgroundSize: 'cover', backgroundPosition: 'center' }}
					/>
					<span className={`${player.rank <= 3 ? 'text-white font-semibold' : 'text-slate-300'}`}>
						{player.username}
					</span>
				</div>
			</td>
			<td className="py-4 text-right pr-2 font-mono text-cyan-400">
				{player.xp.toLocaleString()}
			</td>
		</tr>
	);
};

export default Rank; 