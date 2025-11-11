import { useEffect, useState } from "react";
import { start } from "../../OnlinePong/start.ts";
import { useNavigate } from "react-router-dom"
import { useDashboard } from "../../Providers/DashboardProvider";
import io, { Socket } from "socket.io-client";
import { hoverEffect } from "../../Utils/style.ts";
import { ImSpinner9 } from "react-icons/im";

type ButtonMenuProps = {
	className?: string;
	onClick: () => void;
	children?: React.ReactNode;
};

function ButtonMenu({ className, onClick, children }: ButtonMenuProps) {
	return (
		<div
			onClick={onClick}
			className={className}
		>
			{children}
		</div>
	);
}

function OnlineGame() {
	const [loading, setLoading] = useState(true);
	const [overlay, setOverlay] = useState(false);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [winner, setWinner] = useState<string>("");
	const [role, setRole] = useState<string>("");
	const [begin, setBegin] = useState(false);
	const navigate = useNavigate();
	const { theme } = useDashboard();

	useEffect(() => {
		const s = io("http://localhost:3005/");
		setSocket(s);
		s.on("ready", () => {
			setBegin(true);
		});

		s.on("role", data => {
			setRole(data);
		});
		return () => {
			s.disconnect();
		};
	}, []);
	useEffect(() => {
		if (!begin || !socket || !theme) return;
		const clean = start(
			theme,
			socket,
			() => setLoading(false),
			(winnerRole: string) => {
				setWinner(winnerRole);
				setOverlay(true);
			},
		);
		return () => {
			clean();
		};
	}, [begin, socket]);


	function handleQuit() {
		socket?.disconnect();
		navigate("/dashboard/play");
	}
	return (
		<div className="h-full">
			<div className="text-white flex flex-col items-center justify-center font-sans">
				<div id="MainBoard" className="flex h-[60%] w-[70%] mx-auto">
					<p
						id="player1"
						className="font-bold [writing-mode:vertical-rl] rotate-180 text-center"
						style={{ color: theme?.paddle1 }}
					>Player 1</p>
					<canvas id="board" className="border-4 rounded-lg h-full w-full shadow-lg"
						style={{ backgroundColor: theme?.boardBackground, borderColor: theme?.boardBorder }}
					></canvas>
					<p
						id="player2"
						className="font-bold [writing-mode:vertical-rl] rotate-180 text-center"
						style={{ color: theme?.paddle2 }}
					>Player 2</p>
				</div>
			</div>
			{overlay && (
				<div className="absolute z-10 top-0 w-[100%] h-[100%] flex flex-col 
			items-center justify-center 
			bg-black/30 backdrop-blur-[2px] text-white">
					<h1 className="text-4xl text-center text-cyan- font-bold mb-6">
						{winner === role ? "You win ! 🏆" : "You lose ! 🤕"}
					</h1>
					<ButtonMenu
						onClick={handleQuit}
						className={`cursor-pointer mr-1.5 py-1.5 px-6 text-xl flex items-center 
						h-max gap-2 backdrop-blur-xl rounded-xl 
					bg-cyan-800/5 shadow-md shadow-cyan-500/50 ${hoverEffect}`} >
						Home
					</ButtonMenu>
				</div>
			)}
			{loading && (
				<div className="absolute z-10 top-0 w-[100%] h-[100%] flex flex-col items-center justify-center 
				bg-black/30 backdrop-blur-[2px] text-white">
					<h1 id="pending" className="text-4xl text-center text-cyan- font-bold mb-6">Waiting for another player</h1>
					<span><ImSpinner9 className="size-6 text-cyan-500 mb-6 animate-spin inline ml-2" /></span>
					<ButtonMenu
						className={`cursor-pointer mr-1.5 py-1.5 px-6 text-xl flex items-center h-max gap-2 backdrop-blur-xl rounded-xl
						bg-cyan-800/5 shadow-md shadow-cyan-500/50 ${hoverEffect}`}
						onClick={handleQuit}>
						Home
					</ButtonMenu>
				</div>
			)}
		</div>
	);
}

export default OnlineGame;