import MenuCard from "../../Components/pong/menuCard.tsx"
import { useNavigate } from "react-router-dom"

export const Menu = () => {
	const navigate = useNavigate();
	return (
		<>
			<div className="text-white flex flex-col items-center justify-center h-full font-sans">
				<div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
					<MenuCard
						title="Local Play"
						description="Challenge a friend on the same device."
						onClick={() => navigate("/dashboard/play/pong")}
						buttonContent="Start"
						bgColor="bg-blue-800"
					/>
					<MenuCard
						title="Local Tournament"
						description="Challenge your friends to see who is the best on the same device."
						onClick={() => navigate("/dashboard/play/tournament")}
						buttonContent="Start"
						bgColor="bg-blue-800"
					/>
					<MenuCard
						title="Online Play"
						description="Compete against players from around the world to climb the rankings."
						onClick={() => navigate("/dashboard/play/online")}
						buttonContent="Start"
						bgColor="bg-[url(/images/bg-card3.png)] bg-cover"
					/>
				</div>
				<div className="flex flex-col md:flex-row items-center justify-center space-y-8 mt-5 md:space-y-0 md:space-x-8">
					<MenuCard
						title="Multiplaye Online"
						description="Double the player, double the fun."
						onClick={() => navigate("/dashboard/play/multiplayer")}
						buttonContent="Start"
						bgColor="bg-[url(/images/bg-card3.png)] bg-cover"
					/>
				</div>
			</div>
		</>
	)
}