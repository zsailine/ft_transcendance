import { useNavigate } from "react-router-dom"

function ButtonTournament() {
	const navigate = useNavigate()

	const handleStart = () => {
		navigate("/tournament")
	}
	return (  
		<>
			<button
				onClick={handleStart}
      			className="px-6 py-3 bg-yellow-400 text-gray-900 text-xl font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition-all">
      		START TOURNAMENT
    		</button>
		</>
	);
}

export default ButtonTournament ;