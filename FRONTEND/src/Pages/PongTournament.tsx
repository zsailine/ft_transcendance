import { useEffect} from "react";
import { initTournament} from "../Pong/tournament.tsx";

function PongTournament() {
	useEffect(() => {
		initTournament();
	}, []);
	return ( 
	<>
		<div id="form" className="flex flex-col items-center justify-center space-y-4">
 		<form id="tournamentForm" className="flex flex-col items-center space-y-3 bg-gray-800 p-6 rounded-lg shadow-lg">
 		    <label htmlFor="players" className="text-lg font-semibold">Choose the number of players:</label>
 		    <select name="players" id="players" className="bg-white text-gray-900 rounded px-3 py-1">
 		       <option value="">Select...</option>
 		       <option value="4">4</option>
 		       <option value="8">8</option>
 		       <option value="16">16</option>
 		     </select>
 		     <div id="aliasesContainer" className="flex flex-col space-y-2 w-full mt-3">
 		     </div>
 		     <button id="submitBtn"
 		       className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow hover:bg-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
 		       disabled>
 		       Submit
 		     </button>
 		   </form>
 		 </div>
	</>
	 );
}

export default PongTournament;