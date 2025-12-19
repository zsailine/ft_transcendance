import type { ThemeColors } from "../../Providers/DashboardProvider";

export default function Board({ player, theme }: { player: string[], theme: ThemeColors }) {
	return (
		<div className="flex-1 text-white flex flex-col items-center justify-center h-full font-sans">
			<div id="MainBoard" className="flex h-[60%] w-[70%] mx-auto">
				<p
					id="player1"
					className="font-bold [writing-mode:vertical-rl] rotate-180 text-center"
					style={{ color: theme?.paddle1 }}
				>{player[0]}</p>
				<canvas id="board" className="border-4 rounded-lg h-full w-full shadow-lg"
					style={{ backgroundColor: theme?.boardBackground, borderColor: theme?.boardBorder }}
				></canvas>
				<p
					id="player2"
					className="font-bold [writing-mode:vertical-rl] rotate-180 text-center"
					style={{ color: theme?.paddle2 }}
				>{player[1]}</p>
			</div>
		</div>
	);
}