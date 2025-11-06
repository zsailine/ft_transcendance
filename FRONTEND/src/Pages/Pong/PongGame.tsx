import { useEffect} from "react";
import { initGame} from "../../Pong/game.ts";
import { useNavigate } from "react-router-dom"


function PongGame() {
  const navigate = useNavigate();

  useEffect(() => {
    const clean = initGame();

    return () => clean();
  }, []);

  function handleQuit() {
    navigate("/dashboard/play");
  }

	return ( 
	<>
		<div className="bg-gray-900 text-white flex flex-col items-center justify-center h-full font-sans">
		<div id="MainBoard" className="flex h-[60%] w-[70%] mx-auto">
			<p id="player1" className="font-bold [writing-mode:vertical-rl] rotate-180 text-center">Player 1</p>
			<canvas id="board" className="border-4 border-white rounded-lg bg-green-700 h-full w-full shadow-lg"></canvas>
			<p id="player2" className="font-bold [writing-mode:vertical-rl] text-center">Player 2</p>
			</div>
			<button id="rst"
			className="px-4 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-all">
			Reset
			</button>
			<button
				id="backBtn"
				 onClick={handleQuit}
				className="px-3 py-1 mt-3 text-sm border border-gray-400 rounded hover:bg-gray-200 hover:text-gray-900 transition-all">
				Quit
			</button>
  		</div>
	</>
	 );
}

export default PongGame;