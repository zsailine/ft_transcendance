import ButtonClassic from "../Components/ButtonClassic"
import ButtonTournament from "../Components/ButtonTournament"


export const Menu = () => {
	
	return(
		<>
			<div className="bg-gray-900 text-white flex flex-col items-center justify-center min-h-screen font-sans">
				<div className="flex flex-col items-center justify-center space-y-6 ">
					<ButtonClassic/>
					<ButtonTournament/>
				</div>
			</div>
		</>
	)
}