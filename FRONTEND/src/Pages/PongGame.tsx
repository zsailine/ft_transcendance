import { useEffect} from "react";
import { initGame} from "../Pong/game.tsx";

function PongGame() {

	useEffect(() => {
		initGame();
	}, []);

	return ( 
	<>
		<div id="game" className="flex flex-col items-center justify-center space-y-4">
			<div id="MainBoard" className="flex">
			<p id="player1" className="font-bold [writing-mode:vertical-rl] rotate-180 text-center">Player 1</p>
			<canvas id="board" className="border-4 border-white rounded-lg bg-green-700 shadow-lg width 70vw"></canvas>
			<p id="player2" className="font-bold [writing-mode:vertical-rl] text-center">Player 2</p>
			</div>
			<h2 id="score" className="text-2xl font-bold">0 : 0</h2>
			<button id="rst"
			className="px-4 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-all">
			Reset
			</button>
			<button
				id="backBtn"
				className="px-3 py-1 mt-3 text-sm border border-gray-400 rounded hover:bg-gray-200 hover:text-gray-900 transition-all">
				Quit
			</button>
  		</div>
	</>
	 );
}

export default PongGame;