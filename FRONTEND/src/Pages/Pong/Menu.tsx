import MenuCard from "../../Components/pong/menuCard.tsx"
import { useNavigate } from "react-router-dom"

export const Menu = () => {
	const navigate = useNavigate();
	return (
		<>
			<div className="text-white flex flex-col items-center justify-center h-full font-sans">
				<div className="w-[100%] md:w-[70%] flex-wrap flex flex-col md:flex-row items-between justify-center md:justify-around gap-20 md:space-y-0 mb-9">
					<MenuCard
						title="Local Play"
						description="Challenge a friend on the same device."
						onClick={() => navigate("/dashboard/play/pong")}
						buttonContent="Start"
						bgCard="bg-[url(/images/bg-card3.png)] bg-contain bg- bg-no-repeat bg-center"
					/>
					<MenuCard
						title="Local Tournament"
						description="Challenge your friends to see who is the best on the same device."
						onClick={() => navigate("/dashboard/play/tournament")}
						buttonContent="Start"
						bgCard="bg-[url(/images/bg-card2.png)] bg-cover"
					/>
					<MenuCard
						title="Online Play"
						description="Compete against players from around the world to climb the rankings."
						onClick={() => navigate("/dashboard/play/online")}
						buttonContent="Start"
						bgCard="bg-[url(/images/bg-card4.png)] bg-cover"
					/>
					<MenuCard
						title="Multiplayer Online"
						description="Cooperate to win, double the player, double the fun."
						onClick={() => navigate("/dashboard/play/multiplayer")}
						buttonContent="Start"
						bgCard="bg-[url(/images/bg-card5.png)] bg-cover"
					/>
				</div>
			</div>
		</>
	)
}