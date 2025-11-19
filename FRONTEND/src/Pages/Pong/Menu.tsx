import ButtonClassic from "../../Components/pong/ButtonClassic.tsx"
import ButtonTournament from "../../Components/pong/ButtonTournament.tsx"
import ButtonOnline from "../../Components/pong/ButtonOnline.tsx"
import ButtonOption from "../../Components/pong/ButtonOption.tsx"
import ButtonOnlineTournament from "../../Components/pong/ButtonOnlineTournament.tsx"
import { useState } from "react"

export const Menu = () => {
	const [option, setOPtion] = useState(0);
	function local() { setOPtion(1); }
	function online() { setOPtion(2); }
	function back() { setOPtion(0); }
	return (
		<>
			<div className="text-white flex flex-col items-center justify-center h-full font-sans">
				<div className="flex flex-col items-center justify-center space-y-6 ">
					{option === 0 &&
						<>
							<ButtonOption onClick={local} content="Local" />
							<ButtonOption onClick={online} content="Online" />
						</>
					}
					{option === 1 &&
						<>
							<ButtonClassic />
							<ButtonTournament />
							<ButtonOption onClick={back} content="Back" />
						</>
					}
					{option === 2 &&
						<>
							<ButtonOption onClick={() => setOPtion(3)} content="Multiplayer" />
							<ButtonOnlineTournament />
							<ButtonOption onClick={back} content="Back" />
						</>
					}
					{option === 3 && (
						<>
							<ButtonOnline type="quick" text="Quick Match" />
							<ButtonOnline type="create" text="Create Room" />
							<ButtonOnline type="join" text="Join Room" />
							<ButtonOption onClick={() => setOPtion(2)} content="Back" />
						</>
					)}
				</div>
			</div>
		</>
	)
}