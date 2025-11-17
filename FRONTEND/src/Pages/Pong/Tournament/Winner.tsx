import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../Providers/TournamentProvider";

export default function Winner() {
	const { aliases } = useContext(UserContext);
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center space-y-6 w-full">
			<h2 className="text-2xl font-bold text-yellow-400 mb-4">{aliases[0]} won the tournament</h2>
			<button
				onClick={() => {navigate("/dashboard/play")}}
				className="bg-yellow-400 text-black px-4 py-2 rounded"
			>
				Home
			</button>
		</div>
	);
}