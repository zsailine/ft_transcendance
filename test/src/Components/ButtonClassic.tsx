import { useNavigate } from "react-router-dom"

function ButtonClassic() {
	const navigate = useNavigate()

	const handleStart = () => {
		navigate("/pong")
	}
	return (  
		<>
			<button
				onClick={handleStart}
      			className="px-6 py-3 bg-yellow-400 text-gray-900 text-xl font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition-all">
      		START
    		</button>
		</>
	);
}

export default ButtonClassic