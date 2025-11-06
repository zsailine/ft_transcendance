import ButtonClassic from "../../Components/ButtonClassic"
import ButtonTournament from "../../Components/ButtonTournament"
import ButtonOnline from "../../Components/ButtonOnline"

export const Menu = () => {
	
	return(
		<>
			<div className="text-white flex flex-col items-center justify-center h-full font-sans">
				<div className="flex flex-col items-center justify-center space-y-6 ">
					<ButtonClassic/>
					<ButtonTournament/>
					<ButtonOnline />
				</div>
			</div>
		</>
	)
}