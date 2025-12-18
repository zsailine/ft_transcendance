import { hover, motion } from "framer-motion";
import ButtonMenu from "./ButtonMenu";
import { useNavigate } from "react-router-dom";

type OverlayResultProps = {
	winner: string;
	onQuit: () => void;
	hoverEffect?: string;
    buttonText: string
};

export default function OverlayResult({ buttonText, winner, onQuit, hoverEffect }: OverlayResultProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -30 }}
			transition={{ duration: 1, ease: "easeOut" }}
			className="absolute z-10 top-0 w-full h-full flex flex-col items-center justify-center 
			bg-black/30 backdrop-blur-[2px] text-white"
		>
			<h1 className="text-4xl text-center font-bold mb-6">
				{winner}
			</h1>
			<ButtonMenu
				onClick={onQuit}
				className={`cursor-pointer mr-1.5 py-1.5 px-6 text-xl flex items-center 
					h-max gap-2 backdrop-blur-xl rounded-xl 
					bg-cyan-800/5 shadow-md shadow-cyan-500/50 ${hoverEffect}`}
			>
				{buttonText}
			</ButtonMenu>
		</motion.div>
	);
}
