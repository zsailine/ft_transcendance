import { useEffect, useState} from "react";
import {start} from "../OnlinePong/start.ts";
import { useNavigate } from "react-router-dom"
import io, { Socket } from "socket.io-client";

type ButtonMenuProps = {
	className?: string;
	onClick: () => void;
	children?: React.ReactNode;
};

function ButtonMenu({ className, onClick, children }: ButtonMenuProps) {
	return (
		<button
			onClick={onClick}
			className={className}
		>
			{children}
		</button>
	);
}

function OnlineGame() {
	const [loading, setLoading] = useState(true);
	const [overlay, setOverlay] = useState(false);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [winner, setWinner] = useState<string>("");
	const [role, setRole] = useState<string>("");
	const navigate = useNavigate();

	useEffect(() => {
		const s = io("http://localhost:3000");
		setSocket(s);
		s.on("ready", () =>
		{
			start(
				s,
				() => setLoading(false),
				(winnerRole: string) => {
					setWinner(winnerRole);
					setOverlay(true);
				},
			);
		});
		s.on("role", data => {
			setRole(data);
		});

		return () => {
			s.disconnect();
		};
	}, []);

	function handleQuit() {
		socket?.disconnect(); 
		navigate("/");
	}
	return ( 
	<>
		<div id="game" className="flex flex-col items-center justify-center space-y-4">
			<div id="MainBoard" className="flex">
			<p id="player1" className="font-bold [writing-mode:vertical-rl] rotate-180 text-center">Player 1</p>
			<canvas id="board" className="border-4 border-white rounded-lg bg-green-700 shadow-lg width 70vw"></canvas>
			<p id="player2" className="font-bold [writing-mode:vertical-rl] text-center">Player 2</p>
			</div>
			{overlay && (
				<div className="fixed inset-0 flex flex-col items-center justify-center 
				bg-black/50 text-white z-50">
					<h1 className="text-4xl font-bold mb-6">
						{winner === role ? "You win ! 🏆" : "You lose ! 🤕"}
					</h1>
				<ButtonMenu 			
						onClick={handleQuit}
						className="px-6 py-3 bg-green-400 text-gray-900 text-xl font-semibold rounded-lg shadow-md hover:bg-green-300 transition-all" >
						Home
				</ButtonMenu>
				</div>
			)}
			{loading && (
				<div className="fixed inset-0 flex flex-col items-center justify-center 
		 		 bg-black/50 text-white z-50">
					<h1 id="pending" className="text-4xl font-bold mb-6">Waiting for another player</h1>
					<ButtonMenu 
						className="px-6 py-3 bg-green-400 text-gray-900 text-xl font-semibold rounded-lg shadow-md hover:bg-green-300 transition-all" 
						onClick={handleQuit}>
						Home
					</ButtonMenu>
				</div>
			)}
		</div>
	</>
	 );
}

export default OnlineGame;